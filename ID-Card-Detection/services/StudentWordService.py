import io
import os
import uuid
import shutil
import asyncio
from io import BytesIO
from fastapi import HTTPException
from concurrent.futures import ThreadPoolExecutor
from typing import Awaitable, Callable
from docx.shared import Pt
from utils.progress_tracker_utils import create_progress_tracker, finish_progress, update_progress
from utils.zip_utils import extract_zip, get_student_folders, list_images, delete_extracted_folder
from utils.word_utils import create_document, add_folder_title, add_student_table
from utils.setup_logger_utils import setup_logger
from services.IDCardService import IDCardService

# ------------------- Logger -------------------
logger = setup_logger("student_word_service_logger", "student_word_service.log")

ProgressCallback = Callable[[int, str], Awaitable[None]]

# ------------------- Service -------------------
class StudentWordService:
    def __init__(
        self,
        id_card_service: IDCardService,
        *,
        temp_dir: str,
        max_workers: int,
        queue_max_size: int,
    ):
        self.id_card_service = id_card_service
        self.tmp_dir = temp_dir
        self.queue_max_size = queue_max_size
        self.executor = ThreadPoolExecutor(max_workers=max_workers)
        os.makedirs(self.tmp_dir, exist_ok=True)

    # ------------------- Helper: process a single image asynchronously -------------------
    async def _emit_progress(
        self,
        tracker: dict,
        step: int = 1,
        label: str = "",
        progress_callback: ProgressCallback | None = None,
    ) -> None:
        progress = update_progress(tracker, step, label)
        if progress_callback:
            await progress_callback(progress, label or "Processing")

    # ------------------- Helper: process a single image asynchronously -------------------
    async def _process_image(
        self,
        file_path: str,
        tracker: dict,
        progress_callback: ProgressCallback | None = None,
    ) -> BytesIO | None:
        try:
            loop = asyncio.get_running_loop()
            processed_bytes = await loop.run_in_executor(
                self.executor,
                lambda: self.id_card_service.process_id_image_sync(file_path)
            )

            await self._emit_progress(
                tracker,
                1,
                f"Processed image: {os.path.basename(file_path)}",
                progress_callback,
            )

            return BytesIO(processed_bytes)

        except Exception as e:
            logger.error(f"Failed image {file_path}: {e}")
            await self._emit_progress(
                tracker,
                1,
                f"Failed image: {os.path.basename(file_path)}",
                progress_callback,
            )
            return None

    # ------------------- Helper: process a single student folder asynchronously -------------------
    async def _process_folder(
        self,
        folder_path: str,
        tracker: dict,
        progress_callback: ProgressCallback | None = None,
    ):
        tasks = {}
        for file_path in list_images(folder_path):
            file_name = os.path.basename(file_path)
            name = os.path.splitext(file_name)[0].lower()
            if name in ("guardian_id_front", "national_id_front"):
                tasks[name] = asyncio.create_task(
                    self._process_image(file_path, tracker, progress_callback)
                )

        # Wait for all tasks in parallel
        results = await asyncio.gather(*tasks.values(), return_exceptions=True)

        results_dict = {name: result for name, result in zip(tasks.keys(), results)}

        await self._emit_progress(
            tracker,
            1,
            f"Processed folder: {os.path.basename(folder_path)}",
            progress_callback,
        )

        return (
            results_dict.get("guardian_id_front"),
            results_dict.get("national_id_front"),
        )

    # ------------------- Main ZIP processing -------------------
    async def process_zip_path(
        self,
        zip_path: str,
        progress_callback: ProgressCallback | None = None,
    ) -> io.BytesIO:

        if not zip_path.lower().endswith(".zip"):
            raise HTTPException(status_code=422, detail="Only ZIP files allowed")

        if not os.path.exists(zip_path):
            raise HTTPException(status_code=404, detail="ZIP file not found on server")

        tmp_zip_path = None
        extracted_folder = None

        try:
            # ------------------- Save ZIP -------------------
            unique_name = f"{uuid.uuid4().hex}_{os.path.basename(zip_path)}"
            tmp_zip_path = os.path.join(self.tmp_dir, unique_name)
            shutil.copyfile(zip_path, tmp_zip_path)

            # ------------------- Extract -------------------
            extracted_folder = extract_zip(tmp_zip_path)

            student_folders = get_student_folders(extracted_folder)

            if not student_folders:
                raise HTTPException(status_code=400, detail="No student folders found")

            total_images = sum(len(list_images(f)) for f in student_folders)
            tracker = create_progress_tracker(total_images + len(student_folders))
            if progress_callback:
                await progress_callback(0, "ZIP extracted")

            document = create_document()
            students_on_page = 0

            # queue for processed students
            queue = asyncio.Queue(maxsize=self.queue_max_size)

            # ------------------- worker -------------------
            async def worker(folder_path):
                try:
                    guardian_img, national_img = await self._process_folder(
                        folder_path, tracker, progress_callback
                    )

                    await queue.put(
                        (folder_path, guardian_img, national_img)
                    )

                except Exception as e:
                    logger.error(f"Worker failed {folder_path}: {e}")

            # ------------------- start workers -------------------
            workers = [
                asyncio.create_task(worker(folder))
                for folder in student_folders
            ]

            # ------------------- writer loop -------------------
            finished = 0
            total = len(student_folders)

            while finished < total:
                folder_path, guardian_img, national_img = await queue.get()

                folder_name = os.path.basename(folder_path)

                add_folder_title(document, folder_name)
                add_student_table(document, guardian_img, national_img)

                # free memory immediately
                del guardian_img
                del national_img

                students_on_page += 1

                if students_on_page >= 6:
                    document.add_page_break()
                    students_on_page = 0

                finished += 1

            await asyncio.gather(*workers)

            # ------------------- Save -------------------
            doc_stream = io.BytesIO()
            document.save(doc_stream)
            doc_stream.seek(0)

            finish_progress()
            if progress_callback:
                await progress_callback(100, "Word document generated")
            return doc_stream

        except Exception as e:
            logger.error(f"ZIP processing failed: {e}")
            raise HTTPException(status_code=500, detail=str(e))

        finally:
            if extracted_folder and os.path.exists(extracted_folder):
                delete_extracted_folder(extracted_folder)

            if tmp_zip_path and os.path.exists(tmp_zip_path):
                os.remove(tmp_zip_path)

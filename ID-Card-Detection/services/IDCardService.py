import cv2
import numpy as np
from fastapi import UploadFile, HTTPException
from utils.image_utils import (
    apply_orientation,
    configure_opencv,
    find_orientation,
    detect_and_crop_id,
    resize_to_egyptian_id,
)
from utils.setup_logger_utils import setup_logger

logger = setup_logger("id_card_service_logger", "id_card_service.log")


class IDCardService:
    def __init__(
        self,
        base_dir: str,
        *,
        template_path: str,
        model_path: str,
        allowed_extensions: set[str],
        yolo_confidence: float,
        yolo_image_size: int,
        opencv_num_threads: int,
    ):
        self.base_dir = base_dir
        self.allowed_extensions = allowed_extensions
        self.template_path = template_path
        self.model_path = model_path
        self.yolo_confidence = yolo_confidence
        self.yolo_image_size = yolo_image_size
        configure_opencv(opencv_num_threads)

    # ------------------- Helper -------------------

    async def _load_image(self, file: UploadFile) -> np.ndarray:
        extension = file.filename.split(".")[-1].lower()

        if extension not in self.allowed_extensions:
            logger.warning(f"Invalid file extension: {extension}")
            raise HTTPException(
                status_code=422,
                detail=f"Invalid file type '{extension}'. Allowed: {', '.join(self.allowed_extensions)}"
            )

        file_bytes = await file.read()

        if not file_bytes:
            logger.warning(f"Empty or missing file: {file.filename}")
            raise HTTPException(status_code=422, detail="Uploaded file is empty or missing.")

        np_arr = np.frombuffer(file_bytes, np.uint8)
        img = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)

        if img is None:
            logger.error(f"Failed to read image: {file.filename}")
            raise HTTPException(status_code=404, detail="Image could not be read.")

        return img

    # ------------------- Orientation -------------------

    def _fix_orientation(self, img: np.ndarray) -> np.ndarray:
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

        M = find_orientation(gray, self.template_path)

        if M is not None:
            _, result_img, _ = apply_orientation(gray, img, M)
            return result_img

        h, w = img.shape[:2]

        if h > w:
            return cv2.rotate(img, cv2.ROTATE_90_CLOCKWISE)

        logger.warning("Homography not found, returning original orientation")
        return img

    # ------------------- Process File -------------------

    async def process_id_image(self, file: UploadFile) -> bytes:
        try:
            img = await self._load_image(file)

            # Fix orientation
            img = self._fix_orientation(img)

            # Detect ID
            img = detect_and_crop_id(
                img,
                self.model_path,
                confidence=self.yolo_confidence,
                image_size=self.yolo_image_size,
            )

            # Resize
            img = resize_to_egyptian_id(img)

            # Encode to JPEG
            success, encoded_image = cv2.imencode(".jpg", img)

            if not success:
                logger.error("Failed to encode image to JPEG")
                raise HTTPException(status_code=400, detail="Failed to encode image.")

            return encoded_image.tobytes()

        except HTTPException:
            raise
        except Exception as e:
            logger.error(f"Error processing file {file.filename}: {e}")
            raise HTTPException(status_code=400, detail=str(e))

    # ------------------- Check Egyptian ID -------------------

    async def is_egyptian_id(self, file: UploadFile) -> bool:
        try:
            img = await self._load_image(file)

            # Fix orientation
            img = self._fix_orientation(img)

            # Detect ID
            detected = detect_and_crop_id(
                img,
                self.model_path,
                confidence=self.yolo_confidence,
                image_size=self.yolo_image_size,
            )

            if detected is not None and detected.size > 0:
                return True

            logger.warning(f"Image {file.filename} is not detected as Egyptian ID")
            return False

        except Exception as e:
            logger.error(f"Error checking ID {file.filename}: {e}")
            return False
        

    def process_id_image_sync(self, file_path: str) -> bytes:
            """
            Synchronous version of process_id_image for CPU-bound tasks.
            Accepts a file path instead of UploadFile for easier parallel execution.
            """
            try:
                # ------------------- Load image -------------------
                img = cv2.imread(file_path)
                if img is None:
                    raise HTTPException(status_code=404, detail=f"Image could not be read: {file_path}")

                # ------------------- Fix orientation -------------------
                gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
                M = find_orientation(gray, self.template_path)

                if M is not None:
                    _, img, _ = apply_orientation(gray, img, M)
                else:
                    h, w = img.shape[:2]
                    if h > w:
                        img = cv2.rotate(img, cv2.ROTATE_90_CLOCKWISE)
                    # else leave as is

                # ------------------- Detect ID -------------------
                img = detect_and_crop_id(
                    img,
                    self.model_path,
                    confidence=self.yolo_confidence,
                    image_size=self.yolo_image_size,
                )

                # ------------------- Resize -------------------
                img = resize_to_egyptian_id(img)

                # ------------------- Encode to JPEG -------------------
                success, encoded_image = cv2.imencode(".jpg", img)
                if not success:
                    raise HTTPException(status_code=400, detail="Failed to encode image.")

                return encoded_image.tobytes()

            except HTTPException:
                raise
            except Exception as e:
                logger.error(f"Error processing image {file_path}: {e}")
                raise HTTPException(status_code=400, detail=str(e))
            
            

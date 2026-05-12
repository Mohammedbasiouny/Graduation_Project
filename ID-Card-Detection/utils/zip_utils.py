import zipfile
import os
import shutil
from utils.setup_logger_utils import setup_logger

logger = setup_logger("zip_utils_logger", "zip_utils.log")


# ----------------------- ZIP Extraction -----------------------

def extract_zip(zip_file: str) -> str:
    """
    Extract the ZIP file and return the root folder.
    Raises ValueError if the ZIP is invalid or empty.
    """
    if not zipfile.is_zipfile(zip_file):
        logger.error(f"Invalid ZIP file: {zip_file}")
        raise ValueError(f"{zip_file} is not a valid zip file")

    zip_name = os.path.splitext(os.path.basename(zip_file))[0]
    extract_path = os.path.join(os.path.dirname(zip_file), zip_name)
    os.makedirs(extract_path, exist_ok=True)

    with zipfile.ZipFile(zip_file, "r") as zip_ref:
        if not zip_ref.namelist():
            logger.warning(f"ZIP file is empty: {zip_file}")
            raise ValueError(f"{zip_file} is empty")
        zip_ref.extractall(extract_path)

    return extract_path

# ----------------------- Get Student Folders -----------------------

def get_student_folders(extracted_folder: str) -> list:
    """
    Return only first-level student folders. Empty list if none.
    """
    if not os.path.exists(extracted_folder):
        logger.warning(f"Extracted folder does not exist: {extracted_folder}")
        return []

    student_folders = [
        entry.path
        for entry in os.scandir(extracted_folder)
        if entry.is_dir()
    ]

    return sorted(student_folders)

# ----------------------- List Images -----------------------

def list_images(folder_path: str) -> list:
    """
    Return valid image files inside a folder.
    """
    try:
        valid_extensions = (".jpg", ".jpeg", ".png", ".webp")

        images = [
            entry.path
            for entry in os.scandir(folder_path)
            if entry.is_file() and entry.name.lower().endswith(valid_extensions)
        ]

        return sorted(images)

    except Exception as e:
        logger.error(f"Error while listing images in {folder_path}: {e}")
        raise


# ----------------------- Delete Extracted Folder -----------------------

def delete_extracted_folder(folder_path: str):
    """
    Delete the extracted folder and all its contents.
    """
    try:
        if os.path.isdir(folder_path):
            shutil.rmtree(folder_path)
        else:
            logger.warning(f"Folder not found or not a directory: {folder_path}")

    except Exception as e:
        logger.error(f"Error deleting folder {folder_path}: {e}")
        raise
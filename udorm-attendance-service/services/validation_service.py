from fastapi import HTTPException, status
import numpy as np

from core.validation import validate_photo
from schemas.photo import ValidatePhotoResponse
from utils.image_utils import decode_image_bytes
from utils.logger import logger


async def run_photo_validation(image_bytes: bytes) -> ValidatePhotoResponse:
    """
    Returns:
        ValidatePhotoResponse with passed=True if all checks pass.

    Raises:
        HTTP 422 if the image cannot be decoded or any validation check fails.
    """
    # ── Decode bytes → numpy array ──
    image = decode_image_bytes(image_bytes)

    if image is None:
        logger.warning("Photo validation failed — could not decode uploaded file as image.")
        raise HTTPException(
            status_code = status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail      = {
                "passed": False,
                "errors": {
                    "file": "Uploaded file could not be read as an image. Please upload a valid JPEG or PNG file."
                },
            },
        )

    # ── Run all validation checks ──
    result = validate_photo(image)

    if not result.passed:
        raise HTTPException(
            status_code = status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail      = {
                "passed": False,
                "errors": result.errors,
            },
        )

    return ValidatePhotoResponse(passed=True)
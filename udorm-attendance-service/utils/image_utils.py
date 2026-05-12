import cv2
import numpy as np
from typing import Optional

from utils.logger import logger

# ================================
# Decoding
# ================================

def decode_image_bytes(raw_bytes: bytes) -> Optional[np.ndarray]:
    """
    Decode raw image bytes from an HTTP multipart upload into a BGR numpy array.

    Args:
        raw_bytes: Raw bytes from FastAPI UploadFile.read()

    Returns:
        BGR numpy array, or None if decoding fails.
    """
    try:
        buffer = np.frombuffer(raw_bytes, dtype=np.uint8)
        image  = cv2.imdecode(buffer, cv2.IMREAD_COLOR)

        if image is None:
            logger.warning("cv2.imdecode returned None — file may not be a valid image.")
            return None

        return image

    except Exception as e:
        logger.error(f"Failed to decode image bytes: {e}")
        return None

# ================================
# Resizing
# ================================

def resize_frame(image: np.ndarray, max_width: int = 1280) -> np.ndarray:
    """
    Resize a frame so its width does not exceed max_width, preserving the original aspect ratio.

    Args:
        image:     BGR numpy array
        max_width: Maximum allowed width in pixels (default: 1280)

    Returns:
        Resized BGR numpy array, or the original if no resize needed.
    """
    h, w = image.shape[:2]

    if w <= max_width:
        return image

    scale     = max_width / w
    new_w     = max_width
    new_h     = int(h * scale)

    return cv2.resize(image, (new_w, new_h), interpolation=cv2.INTER_AREA)


# ================================
# CLAHE — Contrast Enhancement
# ================================

def apply_clahe(image: np.ndarray) -> np.ndarray:
    """
    Apply CLAHE (Contrast Limited Adaptive Histogram Equalization)
    to normalize lighting across the frame.

    Process:
        1. Convert BGR → LAB color space
        2. Apply CLAHE only to the L (lightness) channel
        3. Convert back to BGR

    Args:
        image: BGR numpy array

    Returns:
        CLAHE-enhanced BGR numpy array, same shape as input.
    """
    clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8, 8))

    lab         = cv2.cvtColor(image, cv2.COLOR_BGR2LAB)
    l, a, b     = cv2.split(lab)
    l_enhanced  = clahe.apply(l)
    lab_enhanced = cv2.merge([l_enhanced, a, b])

    return cv2.cvtColor(lab_enhanced, cv2.COLOR_LAB2BGR)


# ================================
# Face Crop
# ================================

def crop_face(image: np.ndarray, bounding_box: dict, padding: float = 0.2) -> Optional[np.ndarray]:
    """
    Crop a face region from a frame using bounding box coordinates.
    Adds configurable padding around the box to include hair and chin context.

    Args:
        image:       BGR numpy array — full frame
        bounding_box: dict with keys: top, right, bottom, left (pixel coordinates)
        padding:     fraction of face size to add as padding on each side (default 0.2 = 20%)

    Returns:
        Cropped BGR numpy array of the face region,
        or None if the crop region is invalid or out of bounds.
    """
    h, w = image.shape[:2]

    top    = bounding_box["top"]
    right  = bounding_box["right"]
    bottom = bounding_box["bottom"]
    left   = bounding_box["left"]

    face_h = bottom - top
    face_w = right  - left

    if face_h <= 0 or face_w <= 0:
        logger.warning(f"Invalid bounding box dimensions: {bounding_box}")
        return None

    pad_h = int(face_h * padding)
    pad_w = int(face_w * padding)

    y1 = max(0, top    - pad_h)
    y2 = min(h, bottom + pad_h)
    x1 = max(0, left   - pad_w)
    x2 = min(w, right  + pad_w)

    crop = image[y1:y2, x1:x2]

    if crop.size == 0:
        logger.warning("Face crop resulted in empty array — bounding box may be out of frame.")
        return None

    return crop
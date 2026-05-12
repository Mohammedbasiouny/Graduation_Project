import cv2
import numpy as np
from dataclasses import dataclass, field

from core.face_detector import face_detector
from config.settings import settings
from utils.logger import logger

@dataclass
class ValidationResult:
    passed: bool
    errors: dict[str, str] = field(default_factory=dict)


# ================================
# Individual Checks
# ================================

def _check_face_count(image: np.ndarray) -> tuple[bool, str]:
    faces = face_detector.detect(image)

    if len(faces) == 0:
        return False, "No face detected in the photo. Please upload a clear front-facing photo."

    if len(faces) > 1:
        return False, f"{len(faces)} faces detected. The photo must contain exactly one face."

    return True, ""


def _check_aspect_ratio(image: np.ndarray) -> tuple[bool, str]:
    h, w = image.shape[:2]

    if h == 0:
        return False, "Invalid image dimensions."

    actual_ratio   = w / h
    expected_ratio = settings.EXPECTED_ASPECT_RATIO_W / settings.EXPECTED_ASPECT_RATIO_H
    deviation      = abs(actual_ratio - expected_ratio)

    if deviation > settings.ASPECT_RATIO_TOLERANCE:
        return False, (
            f"Photo dimensions are incorrect. "
            f"Expected a {settings.EXPECTED_ASPECT_RATIO_W}x{settings.EXPECTED_ASPECT_RATIO_H} "
            f"ratio (width:height ≈ {expected_ratio:.2f}), "
            f"but got {w}x{h} (ratio: {actual_ratio:.2f}). "
            f"Please upload a standard 4x6 passport-style photo."
        )

    return True, ""


def _check_background(image: np.ndarray) -> tuple[bool, str]:
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    h, w = gray.shape

    # Border thickness — 10% of each dimension
    border_h = max(1, h // 10)
    border_w = max(1, w // 10)

    # Sample four border strips
    top    = gray[:border_h, :]
    bottom = gray[h - border_h:, :]
    left   = gray[:, :border_w]
    right  = gray[:, w - border_w:]

    border_pixels     = np.concatenate([top.flatten(), bottom.flatten(), left.flatten(), right.flatten()])
    mean_brightness   = float(np.mean(border_pixels))

    if mean_brightness < settings.MIN_BACKGROUND_BRIGHTNESS:
        return False, (
            f"Background is too dark (brightness: {mean_brightness:.0f}/255). "
            f"Please use a plain white background and ensure good lighting."
        )

    return True, ""


# ================================
# Master Validation Function
# ================================

def validate_photo(image: np.ndarray) -> ValidationResult:
    errors: dict[str, str] = {}

    # ── Check 1: Face count ──
    passed, reason = _check_face_count(image)
    if not passed:
        errors["face_count"] = reason
        logger.debug(f"Photo validation failed — face_count: {reason}")

    # ── Check 2: Aspect ratio ──
    passed, reason = _check_aspect_ratio(image)
    if not passed:
        errors["aspect_ratio"] = reason
        logger.debug(f"Photo validation failed — aspect_ratio: {reason}")

    # ── Check 3: Background brightness ──
    passed, reason = _check_background(image)
    if not passed:
        errors["background"] = reason
        logger.debug(f"Photo validation failed — background: {reason}")

    if errors:
        logger.info(f"Photo validation failed with {len(errors)} error(s): {list(errors.keys())}")
        return ValidationResult(passed=False, errors=errors)

    logger.info("Photo validation passed all checks.")
    return ValidationResult(passed=True)
import cv2
import numpy as np
from ultralytics import YOLO
from utils.setup_logger_utils import setup_logger

# ----------------------- Setup Logging -----------------------
logger = setup_logger("image_utils_logger", "image_utils.log")

# Enable OpenCV optimizations. Thread count is configured by IDCardService.
cv2.setUseOptimized(True)

# ----------------------- Global Model Cache -----------------------
_yolo_model = None
_template = None
_sift = None
_flann = None
_template_kp = None
_template_des = None


# ----------------------- YOLO MODEL (LAZY + SINGLE LOAD) -----------------------
def get_yolo_model(model_path):
    global _yolo_model

    if _yolo_model is None:
        _yolo_model = YOLO(model_path)

    return _yolo_model


# ----------------------- SIFT INIT (SAFE + FAST) -----------------------
def get_sift():
    global _sift
    if _sift is None:
        _sift = cv2.SIFT_create()
    return _sift


# ----------------------- FLANN MATCHER -----------------------
def get_flann():
    global _flann
    if _flann is None:
        _flann = cv2.FlannBasedMatcher(
            dict(algorithm=1, trees=5),
            dict(checks=50)
        )
    return _flann


# ----------------------- TEMPLATE CACHE -----------------------
def get_template(template_path):
    global _template

    if _template is None:
        _template = cv2.imread(template_path, cv2.IMREAD_GRAYSCALE)

        if _template is None:
            logger.warning(f"Template not found: {template_path}")

    return _template


# ----------------------- TEMPLATE FEATURES CACHE -----------------------
def get_template_features(template_path):
    global _template_kp, _template_des

    if _template_kp is None or _template_des is None:
        template = get_template(template_path)

        if template is None:
            return None, None

        sift = get_sift()
        _template_kp, _template_des = sift.detectAndCompute(template, None)

    return _template_kp, _template_des


# ----------------------- RESIZE OPTIMIZED -----------------------
def resize_for_processing(img, max_size=1200):
    if img is None:
        return None

    h, w = img.shape[:2]

    if max(h, w) > max_size:
        scale = max_size / max(h, w)
        img = cv2.resize(img, (int(w * scale), int(h * scale)), interpolation=cv2.INTER_AREA)

    return img


# ----------------------- ORIENTATION -----------------------
def apply_orientation(gray, img, M):
    try:
        h, w = gray.shape[:2]

        corners = np.float32([
            [0, 0],
            [0, h - 1],
            [w - 1, h - 1],
            [w - 1, 0]
        ])

        transformed = cv2.perspectiveTransform(np.array([corners]), M)[0]

        bx, by, bw, bh = cv2.boundingRect(transformed)

        translation = np.float32([
            [1, 0, -min(bx, 0)],
            [0, 1, -min(by, 0)],
            [0, 0, 1]
        ])

        M = translation @ M

        warped_img = cv2.warpPerspective(
            img, M, (bw, bh),
            flags=cv2.INTER_AREA,
            borderMode=cv2.BORDER_CONSTANT,
            borderValue=(255, 255, 255)
        )

        warped_gray = cv2.warpPerspective(
            gray, M, (bw, bh),
            flags=cv2.INTER_AREA,
            borderMode=cv2.BORDER_CONSTANT,
            borderValue=(255, 255, 255)
        )

        return warped_gray, warped_img, M

    except Exception as e:
        logger.error(f"apply_orientation error: {e}")
        raise


# ----------------------- ORIENTATION DETECTION (OPTIMIZED) -----------------------
def find_orientation(gray, template_path, min_matches=8):
    try:
        gray = resize_for_processing(gray)

        sift = get_sift()
        flann = get_flann()

        kp1, des1 = get_template_features(template_path)
        if des1 is None:
            return None

        kp2, des2 = sift.detectAndCompute(gray, None)
        if des2 is None:
            return None

        matches = flann.knnMatch(des1, des2, k=2)

        good = [m for m, n in matches if m.distance < 0.7 * n.distance]

        if len(good) < min_matches:
            logger.warning(f"Low matches: {len(good)}/{min_matches}")
            return None

        src_pts = np.float32([kp1[m.queryIdx].pt for m in good]).reshape(-1, 1, 2)
        dst_pts = np.float32([kp2[m.trainIdx].pt for m in good]).reshape(-1, 1, 2)

        M, _ = cv2.findHomography(dst_pts, src_pts, cv2.RANSAC, 5.0)

        return M

    except Exception as e:
        logger.error(f"find_orientation error: {e}")
        raise


# ----------------------- YOLO DETECTION (FAST PATH) -----------------------
def configure_opencv(num_threads: int):
    cv2.setNumThreads(num_threads)


def detect_and_crop_id(image, model_path, confidence=0.8, image_size=640):
    try:
        model = get_yolo_model(model_path)

        results = model(
            image,
            conf=confidence,
            imgsz=image_size,
            verbose=False
        )

        boxes = results[0].boxes

        if boxes is None or len(boxes) == 0:
            logger.warning("No ID detected")
            raise Exception("No ID detected")

        x1, y1, x2, y2 = boxes.xyxy[0].cpu().numpy().astype(int)

        return image[y1:y2, x1:x2]

    except Exception as e:
        logger.error(f"detect_and_crop_id error: {e}")
        raise


# ----------------------- FINAL RESIZE -----------------------
def resize_to_egyptian_id(img, width=318, height=205):
    try:
        if img is None:
            raise ValueError("Empty image")

        return cv2.resize(img, (width, height), interpolation=cv2.INTER_AREA)

    except Exception as e:
        logger.error(f"resize error: {e}")
        raise

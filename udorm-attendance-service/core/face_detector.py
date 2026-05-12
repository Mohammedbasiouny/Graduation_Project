import numpy as np
import insightface
from insightface.app import FaceAnalysis
from dataclasses import dataclass

from config.settings import settings
from utils.logger import logger

@dataclass
class DetectedFace:
    bounding_box: dict   # { "top": int, "right": int, "bottom": int, "left": int }
    confidence:   float
    embedding:    np.ndarray

# ================================
# Face Detector
# ================================

class FaceDetector:
    def __init__(self):
        self._app: FaceAnalysis = None
        self._ready: bool = False

    def load(self) -> None:
        """
        Load the InsightFace model pack into memory.
        Must be called once before any call to detect().
        Downloads buffalo_l (~300MB) on first run if not already cached.
        """
        logger.info(f"Loading InsightFace model pack: {settings.INSIGHTFACE_MODEL_PACK}")

        self._app = FaceAnalysis(
            name       = settings.INSIGHTFACE_MODEL_PACK,
            allowed_modules = ["detection", "recognition"],
        )

        self._app.prepare(
            ctx_id    = settings.INSIGHTFACE_CTX_ID,
            det_thresh = settings.DETECTION_THRESHOLD,
            det_size  = (640, 640),
        )

        self._ready = True
        logger.info("InsightFace model loaded and ready.")

    def detect(self, frame: np.ndarray) -> list[DetectedFace]:
        """
        Run detection and recognition on a single frame.
        Returns a list of DetectedFace objects — one per detected face.
        Returns an empty list if no faces are detected or model is not loaded.

        Args:
            frame: BGR numpy array from OpenCV or decoded from incoming image bytes.

        Returns:
            List of DetectedFace — may be empty if no faces pass the detection threshold.
        """
        if not self._ready:
            logger.warning("detect() called before model was loaded. Returning empty result.")
            return []

        raw_faces = self._app.get(frame)

        raw_faces = raw_faces[: settings.MAX_FACES_PER_FRAME]

        results = []
        for face in raw_faces:
            x1, y1, x2, y2 = [int(v) for v in face.bbox]

            if face.normed_embedding is None:
                logger.warning("Face detected but embedding is None — skipping.")
                continue

            results.append(DetectedFace(
                bounding_box = {
                    "top":    y1,
                    "right":  x2,
                    "bottom": y2,
                    "left":   x1,
                },
                confidence = float(face.det_score),
                embedding  = face.normed_embedding.astype(np.float32),
            ))

        return results

    @property
    def is_ready(self) -> bool:
        return self._ready


# ================================
# Shared instance
# ================================

# load() is called from main.py lifespan on startup.
# Injected into endpoints via api/dependencies.py.
face_detector = FaceDetector()
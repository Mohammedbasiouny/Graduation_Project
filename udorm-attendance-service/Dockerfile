FROM python:3.11-slim

WORKDIR /app

# System dependencies for OpenCV
RUN apt-get update && apt-get install -y \
    gcc \
    g++ \
    libgl1 \
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

# Warm the default InsightFace model cache during image build so the first
# runtime startup does not spend several minutes downloading buffalo_l.
RUN python -c "from insightface.app import FaceAnalysis; app = FaceAnalysis(name='buffalo_l', allowed_modules=['detection', 'recognition']); app.prepare(ctx_id=-1, det_size=(640, 640))"

COPY . .

EXPOSE 8001

RUN sed -i 's/\r$//' /app/start.sh

CMD ["sh", "start.sh"]
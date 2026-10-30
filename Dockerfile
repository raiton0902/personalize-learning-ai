FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PORT=7860 \
    COOKIE_SECURE=true

RUN apt-get update && apt-get install -y --no-install-recommends \
    ca-certificates \
    ffmpeg \
    fonts-dejavu-core \
    && rm -rf /var/lib/apt/lists/*

RUN useradd -m -u 1000 user

WORKDIR /home/user/app

COPY --chown=user:user app/requirements.txt ./app/requirements.txt
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r app/requirements.txt "huggingface_hub>=0.26.0"

COPY --chown=user:user app ./app

USER user
WORKDIR /home/user/app/app

EXPOSE 7860

CMD ["python", "-m", "hf_persistence"]

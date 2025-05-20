FROM node:18-bullseye

WORKDIR /app

# Install dependencies
RUN apt-get update && \
    DEBIAN_FRONTEND=noninteractive apt-get install -y --no-install-recommends \
    netcat-openbsd \
    dos2unix \
    ffmpeg \
    libavcodec-extra \
    libavformat-dev \
    libavcodec-dev \
    libavdevice-dev \
    libavfilter-dev \
    libavutil-dev \
    libswscale-dev \
    libswresample-dev \
    libpostproc-dev \
    libsndfile1 \
    libasound2 \
    portaudio19-dev \
    pulseaudio \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Install app dependencies
COPY package.json package-lock.json ./
RUN npm install --force

# Copy application code
COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]
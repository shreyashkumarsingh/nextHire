# Multi-stage build for production
FROM python:3.11-slim as backend

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Create necessary directories
RUN mkdir -p uploads/resumes logs instance

# Set environment variables
ENV FLASK_ENV=production
ENV PYTHONUNBUFFERED=1

# Expose port
EXPOSE 5000

# Run gunicorn
CMD ["gunicorn", "-c", "gunicorn_config.py", "app_production:app"]

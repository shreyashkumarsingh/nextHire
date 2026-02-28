"""
Configuration management for NextHire application
Loads settings from environment variables with sensible defaults
"""
import os
from datetime import timedelta
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()


class Config:
    """Base configuration"""
    
    # Flask
    SECRET_KEY = os.getenv('SECRET_KEY', 'dev-secret-key-change-in-production')
    DEBUG = os.getenv('FLASK_DEBUG', 'False').lower() == 'true'
    
    # Database
    SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URL', 'sqlite:///nexthire.db')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_ECHO = False
    
    # JWT
    JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY', 'dev-jwt-secret-key')
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(days=7)
    JWT_REFRESH_TOKEN_EXPIRES = timedelta(days=30)
    
    # File Upload
    UPLOAD_FOLDER = os.getenv('UPLOAD_FOLDER', 'uploads')
    MAX_FILE_SIZE = int(os.getenv('MAX_FILE_SIZE', 10 * 1024 * 1024))  # 10MB default
    ALLOWED_EXTENSIONS = set(os.getenv('ALLOWED_EXTENSIONS', 'pdf,docx,txt').split(','))
    
    # Pagination
    RESUMES_PER_PAGE = int(os.getenv('RESUMES_PER_PAGE', 20))
    
    # Logging
    LOG_LEVEL = os.getenv('LOG_LEVEL', 'INFO')
    LOG_FILE = os.getenv('LOG_FILE', 'logs/app.log')
    
    # Rate Limiting
    RATELIMIT_ENABLED = True
    RATELIMIT_DEFAULT = os.getenv('RATELIMIT_DEFAULT', '100 per hour')
    RATELIMIT_STORAGE_URL = os.getenv('RATELIMIT_STORAGE_URL', 'memory://')
    
    # Security
    SESSION_COOKIE_SECURE = os.getenv('FLASK_ENV', 'development') == 'production'
    SESSION_COOKIE_HTTPONLY = True
    SESSION_COOKIE_SAMESITE = 'Lax'
    PERMANENT_SESSION_LIFETIME = timedelta(hours=24)
    
    # AWS S3 (optional)
    AWS_ACCESS_KEY_ID = os.getenv('AWS_ACCESS_KEY_ID')
    AWS_SECRET_ACCESS_KEY = os.getenv('AWS_SECRET_ACCESS_KEY')
    AWS_S3_BUCKET = os.getenv('AWS_S3_BUCKET')
    AWS_REGION = os.getenv('AWS_REGION', 'us-east-1')
    USE_S3 = bool(AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY and AWS_S3_BUCKET)


class DevelopmentConfig(Config):
    """Development configuration"""
    DEBUG = True
    SQLALCHEMY_ECHO = False


class ProductionConfig(Config):
    """Production configuration"""
    DEBUG = False
    SESSION_COOKIE_SECURE = True
    SQLALCHEMY_ECHO = False


class TestingConfig(Config):
    """Testing configuration"""
    TESTING = True
    SQLALCHEMY_DATABASE_URI = 'sqlite:///:memory:'
    WTF_CSRF_ENABLED = False


# Configuration dictionary
config = {
    'development': DevelopmentConfig,
    'production': ProductionConfig,
    'testing': TestingConfig,
    'default': DevelopmentConfig
}


def get_config():
    """Get configuration based on FLASK_ENV"""
    env = os.getenv('FLASK_ENV', 'development')
    return config.get(env, config['default'])

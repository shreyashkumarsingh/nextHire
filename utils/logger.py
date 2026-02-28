"""
Logging configuration and utilities for NextHire
"""
import logging
import os
from logging.handlers import RotatingFileHandler
from datetime import datetime


def setup_logging(app):
    """Setup logging for the application"""
    
    # Create logs directory if it doesn't exist
    log_dir = os.path.dirname(app.config['LOG_FILE'])
    if log_dir and not os.path.exists(log_dir):
        os.makedirs(log_dir)
    
    # Set log level
    log_level = getattr(logging, app.config['LOG_LEVEL'].upper(), logging.INFO)
    
    # Create formatter
    formatter = logging.Formatter(
        '[%(asctime)s] %(levelname)s in %(module)s: %(message)s'
    )
    
    # File handler (rotating, max 10MB, keep 10 backups)
    file_handler = RotatingFileHandler(
        app.config['LOG_FILE'],
        maxBytes=10 * 1024 * 1024,  # 10MB
        backupCount=10
    )
    file_handler.setFormatter(formatter)
    file_handler.setLevel(log_level)
    
    # Console handler
    console_handler = logging.StreamHandler()
    console_handler.setFormatter(formatter)
    console_handler.setLevel(log_level)
    
    # Configure app logger
    app.logger.addHandler(file_handler)
    app.logger.addHandler(console_handler)
    app.logger.setLevel(log_level)
    
    # Log startup
    app.logger.info('=' * 80)
    app.logger.info(f'NextHire Application Started - {datetime.now()}')
    app.logger.info(f'Environment: {app.config.get("ENV", "unknown")}')
    app.logger.info(f'Debug Mode: {app.config.get("DEBUG", False)}')
    app.logger.info('=' * 80)


def log_request(app, request):
    """Log HTTP request details"""
    app.logger.info(f'{request.method} {request.path} - {request.remote_addr}')


def log_error(app, error, context=None):
    """Log error with context"""
    app.logger.error(f'Error: {str(error)}', exc_info=True)
    if context:
        app.logger.error(f'Context: {context}')


def log_resume_upload(app, user_id, filename, status='success'):
    """Log resume upload activity"""
    app.logger.info(f'Resume Upload - User: {user_id}, File: {filename}, Status: {status}')


def log_authentication(app, username, action='login', status='success'):
    """Log authentication events"""
    app.logger.info(f'Auth {action.upper()} - User: {username}, Status: {status}')

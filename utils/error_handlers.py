"""
Error handlers and validation utilities
"""
from flask import jsonify
from functools import wraps
from werkzeug.exceptions import HTTPException


class APIError(Exception):
    """Custom API Error class"""
    
    def __init__(self, message, status_code=400, payload=None):
        super().__init__()
        self.message = message
        self.status_code = status_code
        self.payload = payload
    
    def to_dict(self):
        rv = dict(self.payload or ())
        rv['error'] = self.message
        rv['status_code'] = self.status_code
        return rv


def register_error_handlers(app):
    """Register error handlers for the application"""
    
    @app.errorhandler(APIError)
    def handle_api_error(error):
        """Handle custom API errors"""
        app.logger.error(f'API Error: {error.message}')
        response = jsonify(error.to_dict())
        response.status_code = error.status_code
        return response
    
    @app.errorhandler(400)
    def bad_request(error):
        """Handle 400 Bad Request"""
        app.logger.warning(f'Bad Request: {error}')
        return jsonify({
            'error': 'Bad Request',
            'message': str(error.description) if hasattr(error, 'description') else 'Invalid request'
        }), 400
    
    @app.errorhandler(401)
    def unauthorized(error):
        """Handle 401 Unauthorized"""
        return jsonify({
            'error': 'Unauthorized',
            'message': 'Authentication required'
        }), 401
    
    @app.errorhandler(403)
    def forbidden(error):
        """Handle 403 Forbidden"""
        return jsonify({
            'error': 'Forbidden',
            'message': 'You do not have permission to access this resource'
        }), 403
    
    @app.errorhandler(404)
    def not_found(error):
        """Handle 404 Not Found"""
        return jsonify({
            'error': 'Not Found',
            'message': 'The requested resource was not found'
        }), 404
    
    @app.errorhandler(413)
    def request_entity_too_large(error):
        """Handle 413 Payload Too Large"""
        return jsonify({
            'error': 'File Too Large',
            'message': f'Maximum file size is {app.config["MAX_FILE_SIZE"] / (1024*1024)}MB'
        }), 413
    
    @app.errorhandler(429)
    def rate_limit_exceeded(error):
        """Handle 429 Too Many Requests"""
        return jsonify({
            'error': 'Rate Limit Exceeded',
            'message': 'Too many requests. Please try again later.'
        }), 429
    
    @app.errorhandler(500)
    def internal_server_error(error):
        """Handle 500 Internal Server Error"""
        app.logger.error(f'Internal Server Error: {error}', exc_info=True)
        return jsonify({
            'error': 'Internal Server Error',
            'message': 'An unexpected error occurred. Please try again later.'
        }), 500
    
    @app.errorhandler(Exception)
    def handle_unexpected_error(error):
        """Handle any unexpected errors"""
        app.logger.error(f'Unexpected Error: {error}', exc_info=True)
        
        # Handle HTTPException separately
        if isinstance(error, HTTPException):
            return jsonify({
                'error': error.name,
                'message': error.description
            }), error.code
        
        # For all other exceptions
        return jsonify({
            'error': 'Internal Server Error',
            'message': 'An unexpected error occurred'
        }), 500


def validate_required_fields(data, required_fields):
    """
    Validate that all required fields are present
    Returns: (is_valid, error_message)
    """
    missing_fields = [field for field in required_fields if not data.get(field)]
    
    if missing_fields:
        return False, f"Missing required fields: {', '.join(missing_fields)}"
    
    return True, None


def validate_email(email):
    """Validate email format"""
    import re
    email_pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(email_pattern, email) is not None


def validate_file_upload(request, file_key='resume'):
    """
    Validate file upload from request
    Returns: (is_valid, error_message, file_object)
    """
    if file_key not in request.files:
        return False, f'No {file_key} file in request', None
    
    file = request.files[file_key]
    
    if file.filename == '':
        return False, 'No file selected', None
    
    return True, None, file


def handle_errors(func):
    """Decorator to handle errors in route functions"""
    @wraps(func)
    def wrapper(*args, **kwargs):
        try:
            return func(*args, **kwargs)
        except APIError as e:
            raise e
        except Exception as e:
            raise APIError(str(e), status_code=500)
    return wrapper

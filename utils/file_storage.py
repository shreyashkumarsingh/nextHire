"""
File storage utilities for resume uploads
Handles local storage and can be extended for S3
"""
import os
import uuid
from datetime import datetime
from werkzeug.utils import secure_filename


class FileStorage:
    """Handle file storage operations"""
    
    def __init__(self, app):
        self.app = app
        self.upload_folder = app.config['UPLOAD_FOLDER']
        self.max_file_size = app.config['MAX_FILE_SIZE']
        self.allowed_extensions = app.config['ALLOWED_EXTENSIONS']
        
        # Create upload folder if it doesn't exist
        if not os.path.exists(self.upload_folder):
            os.makedirs(self.upload_folder)
    
    def is_allowed_file(self, filename):
        """Check if file extension is allowed"""
        if '.' not in filename:
            return False
        ext = filename.rsplit('.', 1)[1].lower()
        return ext in self.allowed_extensions
    
    def validate_file_size(self, file):
        """Check if file size is within limits"""
        file.seek(0, os.SEEK_END)
        file_size = file.tell()
        file.seek(0)
        return file_size <= self.max_file_size
    
    def generate_unique_filename(self, original_filename):
        """Generate unique filename to avoid collisions"""
        filename = secure_filename(original_filename)
        name, ext = os.path.splitext(filename)
        unique_id = uuid.uuid4().hex[:8]
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        return f"{name}_{timestamp}_{unique_id}{ext}"
    
    def save_file(self, file, subfolder='resumes'):
        """
        Save uploaded file to local storage
        Returns: (success, message, file_info)
        """
        try:
            # Validate file
            if not file or file.filename == '':
                return False, 'No file provided', None
            
            if not self.is_allowed_file(file.filename):
                return False, f'File type not allowed. Allowed: {", ".join(self.allowed_extensions)}', None
            
            if not self.validate_file_size(file):
                max_mb = self.max_file_size / (1024 * 1024)
                return False, f'File too large. Maximum size: {max_mb}MB', None
            
            # Generate unique filename
            unique_filename = self.generate_unique_filename(file.filename)
            
            # Create subfolder if needed
            save_folder = os.path.join(self.upload_folder, subfolder)
            if not os.path.exists(save_folder):
                os.makedirs(save_folder)
            
            # Save file
            file_path = os.path.join(save_folder, unique_filename)
            file.save(file_path)
            
            # Get file size
            file_size = os.path.getsize(file_path)
            
            file_info = {
                'original_filename': file.filename,
                'saved_filename': unique_filename,
                'file_path': file_path,
                'relative_path': os.path.join(subfolder, unique_filename),
                'file_size': file_size,
                'upload_date': datetime.now()
            }
            
            self.app.logger.info(f'File saved successfully: {unique_filename}')
            return True, 'File saved successfully', file_info
            
        except Exception as e:
            self.app.logger.error(f'Error saving file: {str(e)}')
            return False, f'Error saving file: {str(e)}', None
    
    def delete_file(self, file_path):
        """Delete file from storage"""
        try:
            if os.path.exists(file_path):
                os.remove(file_path)
                self.app.logger.info(f'File deleted: {file_path}')
                return True, 'File deleted successfully'
            else:
                return False, 'File not found'
        except Exception as e:
            self.app.logger.error(f'Error deleting file: {str(e)}')
            return False, f'Error deleting file: {str(e)}'
    
    def get_file_path(self, relative_path):
        """Get full file path from relative path"""
        return os.path.join(self.upload_folder, relative_path)
    
    def file_exists(self, file_path):
        """Check if file exists"""
        return os.path.exists(file_path)


# For future S3 implementation
class S3FileStorage(FileStorage):
    """Handle file storage using AWS S3"""
    
    def __init__(self, app):
        super().__init__(app)
        self.use_s3 = app.config.get('USE_S3', False)
        
        if self.use_s3:
            import boto3
            self.s3_client = boto3.client(
                's3',
                aws_access_key_id=app.config['AWS_ACCESS_KEY_ID'],
                aws_secret_access_key=app.config['AWS_SECRET_ACCESS_KEY'],
                region_name=app.config['AWS_REGION']
            )
            self.bucket_name = app.config['AWS_S3_BUCKET']
    
    def save_file_to_s3(self, file, subfolder='resumes'):
        """Upload file to S3 bucket"""
        if not self.use_s3:
            return self.save_file(file, subfolder)
        
        try:
            unique_filename = self.generate_unique_filename(file.filename)
            s3_key = f"{subfolder}/{unique_filename}"
            
            # Upload to S3
            self.s3_client.upload_fileobj(
                file,
                self.bucket_name,
                s3_key,
                ExtraArgs={'ContentType': file.content_type}
            )
            
            # Generate S3 URL
            s3_url = f"https://{self.bucket_name}.s3.{self.app.config['AWS_REGION']}.amazonaws.com/{s3_key}"
            
            file_info = {
                'original_filename': file.filename,
                'saved_filename': unique_filename,
                'file_path': s3_url,
                's3_key': s3_key,
                'upload_date': datetime.now()
            }
            
            return True, 'File uploaded to S3 successfully', file_info
            
        except Exception as e:
            self.app.logger.error(f'Error uploading to S3: {str(e)}')
            return False, f'Error uploading to S3: {str(e)}', None

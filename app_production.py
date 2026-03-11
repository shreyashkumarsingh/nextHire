from flask import Flask, render_template, request, jsonify, session, send_from_directory
from flask_cors import CORS
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from sqlalchemy import or_
import os
from datetime import datetime, timedelta
import json

# Import configuration
from config import get_config

# Import models
from models import db, User, UserProfile, Resume, ResumeSkill, Education, Experience

# Import utilities
from utils.parser import parse_resume, extract_email, extract_phone, extract_name, extract_education, extract_experience
from utils.cleaner import clean_text
from utils.skill_extractor import extract_skills
from utils.matcher import match_skills
from utils.job_matcher import calculate_match_score
from utils.logger import setup_logging, log_resume_upload, log_authentication
from utils.file_storage import FileStorage
from utils.error_handlers import register_error_handlers, APIError, validate_required_fields, validate_file_upload

# Initialize Flask app
app = Flask(__name__)

# Load configuration
config_class = get_config()
app.config.from_object(config_class)

# Configure CORS - allow only specific origins (security)
cors_origins = os.getenv('CORS_ORIGINS', 'http://localhost:3000').split(',')
cors_origins = [origin.strip() for origin in cors_origins]  # Remove whitespace

CORS(app, 
     resources={r"/api/*": {
         "origins": cors_origins,
         "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
         "allow_headers": ["Content-Type", "Authorization"],
         "credentials": True,
         "max_age": 3600
     }})

# Initialize extensions
db.init_app(app)
bcrypt = Bcrypt(app)
jwt = JWTManager(app)

# Helper function to convert JWT identity string to integer
def get_current_user_id():
    """Get user ID as integer from JWT identity"""
    identity = get_jwt_identity()
    try:
        return int(identity) if identity else None
    except (ValueError, TypeError):
        return None


# Setup logging
setup_logging(app)

# Initialize file storage
file_storage = FileStorage(app)

# Setup rate limiting
limiter = Limiter(
    app=app,
    key_func=get_remote_address,
    default_limits=[app.config['RATELIMIT_DEFAULT']],
    storage_uri=app.config['RATELIMIT_STORAGE_URL']
)

# Register error handlers
register_error_handlers(app)

# Add security headers
@app.after_request
def set_security_headers(response):
    """Add security headers to all responses"""
    response.headers['X-Content-Type-Options'] = 'nosniff'
    response.headers['X-Frame-Options'] = 'SAMEORIGIN'
    response.headers['X-XSS-Protection'] = '1; mode=block'
    
    # HSTS only in production with HTTPS
    if app.config.get('FLASK_ENV') == 'production':
        response.headers['Strict-Transport-Security'] = 'max-age=31536000; includeSubDomains; preload'
    
    # CSP - restrict to self and specific sources
    response.headers['Content-Security-Policy'] = "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https:; frame-ancestors 'self'"
    
    return response

# Create database tables
with app.app_context():
    db.create_all()
    app.logger.info('Database tables created/verified')


# ============================================================================
# FRONTEND ROUTES (Serve React App)
# ============================================================================

@app.route("/", methods=["GET"])
def serve_index():
    """Serve React app index.html"""
    return send_from_directory(os.path.join(os.path.dirname(__file__), 'static'), 'index.html')


@app.route('/assets/<path:filename>')
def serve_assets(filename):
    """Serve static assets (CSS, JS, images)"""
    return send_from_directory(os.path.join(os.path.dirname(__file__), 'static', 'assets'), filename)


@app.errorhandler(404)
def catch_all(e):
    """Catch all routes and serve React app for SPA routing"""
    # Don't catch /api routes or static asset routes
    if request.path.startswith('/api/') or request.path.startswith('/assets/'):
        return jsonify({"error": "Not found"}), 404
    
    # Check if the path has a file extension (likely a static file)
    if '.' in request.path.split('/')[-1]:
        return jsonify({"error": "File not found"}), 404
    
    # Serve React app for client-side routing
    return send_from_directory(os.path.join(os.path.dirname(__file__), 'static'), 'index.html')


# ============================================================================
# AUTHENTICATION ROUTES
# ============================================================================

@app.route("/api/auth/signup", methods=["POST"])
@limiter.limit("5 per hour")
def signup():
    """User registration endpoint"""
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['username', 'email', 'password']
        is_valid, error_msg = validate_required_fields(data, required_fields)
        if not is_valid:
            raise APIError(error_msg, 400)
        
        # Check if user already exists
        if User.query.filter_by(username=data['username']).first():
            raise APIError("Username already exists", 400)
        
        if User.query.filter_by(email=data['email']).first():
            raise APIError("Email already exists", 400)
        
        # Hash password
        hashed_password = bcrypt.generate_password_hash(data['password']).decode('utf-8')
        
        # Create new user
        new_user = User(
            username=data['username'],
            email=data['email'],
            password=hashed_password,
            full_name=data.get('full_name', ''),
            company=data.get('company', '')
        )
        
        db.session.add(new_user)
        db.session.commit()
        
        # Log authentication
        log_authentication(app, data['username'], 'signup', 'success')
        
        # Create access token
        access_token = create_access_token(identity=str(new_user.id))
        
        return jsonify({
            "message": "User created successfully",
            "user": new_user.to_dict(),
            "access_token": access_token
        }), 201
        
    except APIError as e:
        raise e
    except Exception as e:
        app.logger.error(f"Signup error: {str(e)}")
        db.session.rollback()
        raise APIError(str(e), 500)


@app.route("/api/auth/login", methods=["POST"])
@limiter.limit("10 per hour")
def login():
    """User login endpoint"""
    try:
        data = request.get_json()
        
        # Validate required fields
        is_valid, error_msg = validate_required_fields(data, ['password'])
        if not is_valid:
            raise APIError(error_msg, 400)

        identifier = data.get('username') or data.get('email') or data.get('identifier')
        if not identifier:
            raise APIError("Username or email is required", 400)
        
        # Find user by username or email
        user = User.query.filter(or_(User.username == identifier, User.email == identifier)).first()
        
        if not user or not bcrypt.check_password_hash(user.password, data['password']):
            log_authentication(app, identifier, 'login', 'failed')
            raise APIError("Invalid username or password", 401)
        
        # Log successful authentication
        log_authentication(app, identifier, 'login', 'success')
        
        # Create access token
        access_token = create_access_token(identity=str(user.id))
        
        return jsonify({
            "message": "Login successful",
            "user": user.to_dict(),
            "access_token": access_token
        }), 200
        
    except APIError as e:
        raise e
    except Exception as e:
        app.logger.error(f"Login error: {str(e)}")
        raise APIError(str(e), 500)


@app.route("/api/auth/me", methods=["GET"])
@jwt_required()
def get_current_user():
    """Get current authenticated user"""
    try:
        current_user_id = get_current_user_id()
        user = User.query.get(current_user_id)
        
        if not user:
            raise APIError("User not found", 404)
        
        return jsonify(user.to_dict()), 200
        
    except APIError as e:
        raise e
    except Exception as e:
        app.logger.error(f"Get current user error: {str(e)}")
        raise APIError(str(e), 500)


@app.route("/api/auth/change-password", methods=["POST"])
@jwt_required()
def change_password():
    """Change password for the authenticated user"""
    try:
        data = request.get_json()
        is_valid, error_msg = validate_required_fields(data, ['current_password', 'new_password'])
        if not is_valid:
            raise APIError(error_msg, 400)

        current_user_id = get_current_user_id()
        user = User.query.get(current_user_id)
        if not user:
            raise APIError("User not found", 404)

        if not bcrypt.check_password_hash(user.password, data['current_password']):
            raise APIError("Current password is incorrect", 400)

        hashed_password = bcrypt.generate_password_hash(data['new_password']).decode('utf-8')
        user.password = hashed_password
        db.session.commit()

        return jsonify({"message": "Password updated successfully"}), 200

    except APIError as e:
        db.session.rollback()
        raise e
    except Exception as e:
        db.session.rollback()
        app.logger.error(f"Change password error: {str(e)}")
        raise APIError(str(e), 500)


# ============================================================================
# RESUME UPLOAD & PARSING ROUTES
# ============================================================================

@app.route("/api/upload", methods=["POST"])
@limiter.limit("10 per hour")
def api_upload_resume():
    """Upload and parse resume with job matching (works for demo and authenticated users)"""
    try:
        # Try to get current user if authenticated
        try:
            current_user_id = get_current_user_id()
            is_authenticated = True
        except:
            # Demo mode - use demo user (ID 0)
            current_user_id = None
            is_authenticated = False
        
        # Validate resume file
        is_valid, error_msg, resume_file = validate_file_upload(request, 'resume')
        if not is_valid:
            raise APIError(error_msg, 400)
        
        # Get job description file (optional)
        jd_file = request.files.get("job_description")
        job_title = request.form.get("job_title", "")
        
        # Save resume file
        success, message, file_info = file_storage.save_file(resume_file, 'resumes')
        if not success:
            raise APIError(message, 400)
        
        # Parse resume
        resume_file.seek(0)
        raw_text = parse_resume(resume_file)
        
        if not raw_text:
            # Clean up saved file if parsing fails
            file_storage.delete_file(file_info['file_path'])
            raise APIError("Could not extract text from resume", 400)
        
        # Parse job description from PDF if provided
        job_description = ""
        jd_file_path = None
        if jd_file:
            jd_success, jd_message, jd_info = file_storage.save_file(jd_file, 'job_descriptions')
            if jd_success:
                jd_file_path = jd_info['file_path']
                jd_file.seek(0)
                job_description = parse_resume(jd_file)
        
        # Extract information
        cleaned = clean_text(raw_text)
        extracted_skills = extract_skills(cleaned)
        matched_skills = match_skills(extracted_skills)

        # Extract candidate information
        extracted_name = extract_name(raw_text) or "Unknown"
        extracted_email = extract_email(raw_text) or "not-provided@email.com"
        extracted_phone = extract_phone(raw_text) or "Not provided"
        extracted_education = extract_education(raw_text)
        extracted_experience = extract_experience(raw_text)

        # Calculate job match score
        match_data = calculate_match_score(raw_text, job_description, job_title)

        # Only save to database if authenticated
        if is_authenticated and current_user_id:
            # Create Resume record in database
            resume = Resume(
                user_id=current_user_id,
                name=extracted_name,
                email=extracted_email,
                phone=extracted_phone,
                filename=file_info['original_filename'],
                file_path=file_info['relative_path'],
                file_size=file_info['file_size'],
                job_title=job_title,
                job_description=job_description,
                score=match_data["score"],
                match_percentage=match_data["match_percentage"],
                raw_text=raw_text,
                status='active'
            )
            
            db.session.add(resume)
            db.session.flush()  # Get resume.id
            
            # Add skills
            for skill in extracted_skills:
                is_matched = skill in match_data.get("matched_skills", [])
                resume_skill = ResumeSkill(
                    resume_id=resume.id,
                    skill_name=skill,
                    is_matched=is_matched
                )
                db.session.add(resume_skill)
            
            # Add missing skills
            for skill in match_data.get("missing_skills", []):
                resume_skill = ResumeSkill(
                    resume_id=resume.id,
                    skill_name=skill,
                    is_matched=False
                )
                db.session.add(resume_skill)
            
            # Add education
            for edu in extracted_education:
                education = Education(
                    resume_id=resume.id,
                    degree=edu.get('degree', ''),
                    institution=edu.get('institution', ''),
                    year=edu.get('year', ''),
                    field_of_study=edu.get('field', '')
                )
                db.session.add(education)
            
            # Add experience
            for exp in extracted_experience:
                experience = Experience(
                    resume_id=resume.id,
                    title=exp.get('title', ''),
                    company=exp.get('company', ''),
                    duration=exp.get('duration', ''),
                    description=exp.get('description', '')
                )
                db.session.add(experience)
            
            db.session.commit()
            
            # Log successful upload
            log_resume_upload(app, current_user_id, file_info['original_filename'], 'success')
        else:
            # Demo mode - store in session so it persists during the session
            demo_resumes = session.get('demo_resumes', [])
            demo_resume = {
                'id': len(demo_resumes) + 1,  # Simple ID for demo
                'name': extracted_name,
                'email': extracted_email,
                'phone': extracted_phone,
                'filename': file_info['original_filename'],
                'score': match_data["score"],
                'matchPercentage': match_data["match_percentage"],
                'uploadDate': datetime.now().strftime('%Y-%m-%d'),
                'status': 'active',
                'skills': [{'name': skill, 'isMatched': skill in match_data.get("matched_skills", [])} for skill in extracted_skills],
                'education': [{
                    'degree': edu.get('degree', ''),
                    'institution': edu.get('institution', ''),
                    'year': edu.get('year', ''),
                    'fieldOfStudy': edu.get('field', ''),
                    'text': edu.get('text', '')
                } for edu in extracted_education],
                'experience': [{'title': exp.get('title', ''), 'company': exp.get('company', ''), 'duration': exp.get('duration', '')} for exp in extracted_experience],
                'matchedSkills': match_data.get("matched_skills", []),
                'missingSkills': match_data.get("missing_skills", [])
            }
            demo_resumes.append(demo_resume)
            session['demo_resumes'] = demo_resumes
        
        # Return response (works for both authenticated and demo)
        response_data = {
            'id': 0 if not is_authenticated else 1,
            'name': extracted_name,
            'email': extracted_email,
            'phone': extracted_phone,
            'file_path': file_info.get('relative_path', ''),
            'filename': file_info['original_filename'],
            'score': match_data["score"],
            'matchPercentage': match_data["match_percentage"],
            'match_percentage': match_data["match_percentage"],
            'matchedSkills': match_data.get("matched_skills", []),
            'matched_skills': match_data.get("matched_skills", []),
            'missingSkills': match_data.get("missing_skills", []),
            'missing_skills': match_data.get("missing_skills", []),
            'breakdown': match_data.get("breakdown"),
            'skills': extracted_skills,
            'education': extracted_education,
            'experience': extracted_experience,
            'uploadDate': datetime.now().strftime('%Y-%m-%d'),
            'demo': not is_authenticated,
            'message': 'Sign in to save this resume permanently' if not is_authenticated else 'Resume saved successfully'
        }
        
        return jsonify(response_data), 200

    except APIError as e:
        db.session.rollback()
        raise e
    except Exception as e:
        db.session.rollback()
        app.logger.error(f"Upload error: {str(e)}", exc_info=True)
        raise APIError(f"Upload failed: {str(e)}", 500)


@app.route("/api/resumes", methods=["GET"])
def api_get_resumes():
    """Get all resumes with pagination (works for demo and authenticated users)"""
    try:
        # Try to get current user if authenticated
        try:
            current_user_id = get_current_user_id()
            is_authenticated = True
        except:
            # Not authenticated - return demo data
            is_authenticated = False
            current_user_id = None
        
        # Get pagination parameters
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', app.config.get('RESUMES_PER_PAGE', 20), type=int)
        
        if is_authenticated and current_user_id:
            # Authenticated user - get their resumes
            # Get filter parameters
            status = request.args.get('status', 'active')
            min_score = request.args.get('min_score', type=int)
            max_score = request.args.get('max_score', type=int)
            
            # Build query
            query = Resume.query.filter_by(user_id=current_user_id, status=status)
            
            if min_score is not None:
                query = query.filter(Resume.score >= min_score)
            if max_score is not None:
                query = query.filter(Resume.score <= max_score)
            
            # Order by most recent
            query = query.order_by(Resume.uploaded_at.desc())
            
            # Paginate
            pagination = query.paginate(page=page, per_page=per_page, error_out=False)
            resumes = [resume.to_dict() for resume in pagination.items]
        else:
            # Unauthenticated/Demo mode - return resumes from session storage
            # This allows demo users to see their uploaded resumes temporarily
            session_resumes = session.get('demo_resumes', [])
            resumes = session_resumes
        
        return jsonify({
            'resumes': resumes,
            'total': len(resumes),
            'pages': 1,
            'current_page': page,
            'per_page': per_page,
            'has_next': False,
            'has_prev': False,
            'demo': not is_authenticated,
            'message': 'Sign in to save and manage your resumes permanently' if not is_authenticated else None
        }), 200
        
    except Exception as e:
        app.logger.error(f"Get resumes error: {str(e)}")
        return jsonify({'error': str(e), 'resumes': []}), 200


@app.route("/api/resumes/<int:resume_id>", methods=["GET"])
@jwt_required()
def api_get_resume(resume_id):
    """Get specific resume by ID"""
    try:
        current_user_id = get_current_user_id()
        resume = Resume.query.filter_by(id=resume_id, user_id=current_user_id).first()
        
        if not resume:
            raise APIError("Resume not found", 404)
        
        return jsonify(resume.to_dict()), 200
        
    except APIError as e:
        raise e
    except Exception as e:
        app.logger.error(f"Get resume error: {str(e)}")
        raise APIError(str(e), 500)


@app.route("/api/resumes/<int:resume_id>", methods=["DELETE"])
@jwt_required()
def api_delete_resume(resume_id):
    """Delete resume by ID"""
    try:
        current_user_id = get_current_user_id()
        resume = Resume.query.filter_by(id=resume_id, user_id=current_user_id).first()
        
        if not resume:
            raise APIError("Resume not found", 404)
        
        # Delete associated file
        if resume.file_path:
            full_path = file_storage.get_file_path(resume.file_path)
            file_storage.delete_file(full_path)
        
        # Delete from database (cascades to related tables)
        db.session.delete(resume)
        db.session.commit()
        
        app.logger.info(f"Resume deleted: {resume_id}")
        
        return jsonify({"message": "Resume deleted successfully"}), 200
        
    except APIError as e:
        db.session.rollback()
        raise e
    except Exception as e:
        db.session.rollback()
        app.logger.error(f"Delete resume error: {str(e)}")
        raise APIError(str(e), 500)


# ============================================================================
# ANALYTICS ROUTES
# ============================================================================

@app.route("/api/analytics", methods=["GET"])
@jwt_required()
def api_get_analytics():
    """Get analytics data"""
    try:
        current_user_id = get_current_user_id()
        resumes = Resume.query.filter_by(user_id=current_user_id, status='active').all()
        
        if not resumes:
            return jsonify({
                "totalResumes": 0,
                "averageScore": 0,
                "topSkill": "N/A",
                "topMatch": 0
            }), 200

        # Calculate analytics
        total_resumes = len(resumes)
        avg_score = sum(r.score for r in resumes) / total_resumes
        top_match = max(r.match_percentage for r in resumes)

        # Get top skill
        all_skills = {}
        for resume in resumes:
            for skill in resume.skills:
                skill_name = skill.skill_name
                all_skills[skill_name] = all_skills.get(skill_name, 0) + 1

        top_skill = max(all_skills.items(), key=lambda x: x[1])[0] if all_skills else "N/A"

        return jsonify({
            "totalResumes": total_resumes,
            "averageScore": round(avg_score, 1),
            "topSkill": top_skill,
            "topMatch": top_match,
            "skillsDistribution": all_skills
        }), 200
        
    except Exception as e:
        app.logger.error(f"Analytics error: {str(e)}")
        raise APIError(str(e), 500)


# ============================================================================
# PROFILE ROUTES
# ============================================================================

@app.route("/api/profile", methods=["GET"])
def get_profile():
    """Get user profile"""
    try:
        # Try to get JWT identity, fallback to first user for testing
        try:
            current_user_id = get_current_user_id()
        except:
            user = User.query.first()
            if not user:
                raise APIError("No user found", 404)
            current_user_id = user.id
        
        user = User.query.get(current_user_id)
        
        if not user:
            raise APIError("User not found", 404)
        
        # Get or create profile
        profile = UserProfile.query.filter_by(user_id=current_user_id).first()
        
        if not profile:
            profile = UserProfile(user_id=current_user_id)
            db.session.add(profile)
            db.session.commit()
        
        # Build response
        response = {
            "fullName": user.full_name or "HR Manager",
            "email": user.email or "",
            "company": user.company or "",
            "title": profile.title or "",
            "location": profile.location or "",
            "about": profile.about or "",
            "photo": profile.photo or "",
            "phone": profile.phone or "",
            "website": profile.website or "",
            "linkedin": profile.linkedin or "",
            "github": profile.github or "",
            "timezone": profile.timezone or "UTC",
            "language": profile.language or "English",
            "theme": profile.theme or "System",
            "notificationEmail": bool(profile.notification_email),
            "notificationPush": bool(profile.notification_push),
            "twoFactorEnabled": bool(profile.two_factor_enabled),
            "teamName": profile.team_name or "",
            "department": profile.department or "",
            "role": profile.role or "",
            "manager": profile.manager or "",
            "emailSignature": profile.email_signature or "",
            "companyLogo": profile.company_logo or "",
            "jobTemplate": profile.job_template or "",
            "integrations": profile.get_integrations() or {},
            "accessLevel": profile.access_level or "Editor",
            "dataExportEnabled": bool(profile.data_export_enabled),
            "gdprRetentionDays": profile.gdpr_retention_days or "90",
            "savedFilters": profile.get_saved_filters() or []
        }
        
        return jsonify(response), 200
        
    except APIError as e:
        raise e
    except Exception as e:
        db.session.rollback()
        app.logger.error(f"Profile GET error: {str(e)}")
        raise APIError(str(e), 500)


@app.route("/api/profile", methods=["PUT"])
@jwt_required()
def update_profile():
    """Update user profile"""
    try:
        current_user_id = get_current_user_id()
        data = request.get_json()
        
        app.logger.info(f"Profile update request for user {current_user_id}")
        app.logger.debug(f"Profile data keys: {list(data.keys()) if data else 'None'}")
        app.logger.debug(f"Full profile data: {data}")
        
        if not data:
            raise APIError("No data provided", 400)
        
        user = User.query.get(current_user_id)
        if not user:
            raise APIError("User not found", 404)
        
        # Get or create profile
        profile = UserProfile.query.filter_by(user_id=current_user_id).first()
        if not profile:
            profile = UserProfile(user_id=current_user_id)
            db.session.add(profile)
        
        # Update user fields
        if 'fullName' in data:
            user.full_name = data['fullName']
        if 'company' in data:
            user.company = data['company']
        if 'email' in data and data['email'] != user.email:
            # Check if email is already taken by another user
            existing_user = User.query.filter_by(email=data['email']).first()
            if existing_user and existing_user.id != current_user_id:
                raise APIError("Email already in use by another account", 400)
            user.email = data['email']
        
        # Update profile fields (same logic as before)
        field_mapping = {
            'title': 'title', 'location': 'location', 'about': 'about', 'photo': 'photo',
            'phone': 'phone', 'website': 'website', 'linkedIn': 'linkedin', 'github': 'github',
            'timezone': 'timezone', 'language': 'language', 'theme': 'theme',
            'notificationEmail': 'notification_email', 'notificationPush': 'notification_push',
            'twoFactorEnabled': 'two_factor_enabled', 'teamName': 'team_name',
            'department': 'department', 'role': 'role', 'manager': 'manager',
            'emailSignature': 'email_signature', 'companyLogo': 'company_logo',
            'jobTemplate': 'job_template', 'accessLevel': 'access_level',
            'dataExportEnabled': 'data_export_enabled', 'gdprRetentionDays': 'gdpr_retention_days'
        }
        
        for json_key, model_attr in field_mapping.items():
            if json_key in data:
                setattr(profile, model_attr, data[json_key])
        
        # Handle special fields
        if 'integrations' in data:
            profile.set_integrations(data['integrations'])
        if 'savedFilters' in data:
            profile.set_saved_filters(data['savedFilters'])
        
        db.session.commit()
        
        return jsonify({"message": "Profile updated successfully"}), 200
        
    except APIError as e:
        db.session.rollback()
        raise e
    except Exception as e:
        db.session.rollback()
        app.logger.error(f"Profile UPDATE error: {str(e)}")
        app.logger.error(f"Exception type: {type(e).__name__}")
        import traceback
        app.logger.error(f"Traceback: {traceback.format_exc()}")
        raise APIError(f"Profile update failed: {str(e)}", 500)


@app.route("/api/profile/two-factor", methods=["POST"])
@jwt_required()
def update_two_factor():
    """Enable or disable two-factor authentication"""
    try:
        data = request.get_json() or {}
        enabled = bool(data.get('enabled', False))

        current_user_id = get_current_user_id()
        user = User.query.get(current_user_id)
        if not user:
            raise APIError("User not found", 404)

        profile = UserProfile.query.filter_by(user_id=current_user_id).first()
        if not profile:
            profile = UserProfile(user_id=current_user_id)
            db.session.add(profile)

        profile.two_factor_enabled = enabled
        db.session.commit()

        return jsonify({"message": "Two-factor setting updated", "enabled": enabled}), 200

    except APIError as e:
        db.session.rollback()
        raise e
    except Exception as e:
        db.session.rollback()
        app.logger.error(f"Two-factor update error: {str(e)}")
        raise APIError(str(e), 500)


# ============================================================================
# HEALTH CHECK
# ============================================================================

@app.route("/api/health", methods=["GET"])
def health_check():
    """Health check endpoint"""
    return jsonify({
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "version": "2.0.0"
    }), 200


if __name__ == "__main__":
    # Development server (NOT for production)
    app.run(debug=app.config['DEBUG'], port=5000, host='0.0.0.0')

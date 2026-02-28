from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from sqlalchemy import or_
import os
from datetime import datetime, timedelta
import random

from models import db, User, UserProfile
from utils.parser import parse_resume, extract_email, extract_phone, extract_name, extract_education, extract_experience
from utils.cleaner import clean_text
from utils.skill_extractor import extract_skills
from utils.matcher import match_skills
from utils.job_matcher import calculate_match_score

app = Flask(__name__)
CORS(app)  # Enable CORS for React frontend

# Configuration
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///nexthire.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = 'nexthire-secret-key-2026-change-in-production'
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(days=7)

# Initialize extensions
db.init_app(app)
bcrypt = Bcrypt(app)
jwt = JWTManager(app)

# Create database tables
with app.app_context():
    db.create_all()

# In-memory storage for demo (replace with database in production)
resumes_db = []


@app.route("/", methods=["GET", "POST"])
def index():
    if request.method == "POST":
        resume_file = request.files.get("resume")
        if not resume_file:
            return render_template("index.html", error="Please upload a resume file.")

        raw_text = parse_resume(resume_file)
        cleaned = clean_text(raw_text)
        extracted = extract_skills(cleaned)
        matched = match_skills(extracted)

        return render_template(
            "results.html",
            extracted_skills=extracted,
            matched_skills=matched,
        )

    return render_template("index.html")


# Authentication Routes

@app.route("/api/auth/signup", methods=["POST"])
def signup():
    """User registration endpoint"""
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['username', 'email', 'password']
        for field in required_fields:
            if not data.get(field):
                return jsonify({"error": f"{field} is required"}), 400
        
        # Check if user already exists
        if User.query.filter_by(username=data['username']).first():
            return jsonify({"error": "Username already exists"}), 400
        
        if User.query.filter_by(email=data['email']).first():
            return jsonify({"error": "Email already exists"}), 400
        
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
        
        # Create access token
        access_token = create_access_token(identity=new_user.id)
        
        return jsonify({
            "message": "User created successfully",
            "user": new_user.to_dict(),
            "access_token": access_token
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500


@app.route("/api/auth/login", methods=["POST"])
def login():
    """User login endpoint"""
    try:
        data = request.get_json()
        
        # Validate required fields
        if not data.get('password'):
            return jsonify({"error": "Password is required"}), 400

        identifier = data.get('username') or data.get('email') or data.get('identifier')
        if not identifier:
            return jsonify({"error": "Username or email is required"}), 400
        
        # Find user by username or email
        user = User.query.filter(or_(User.username == identifier, User.email == identifier)).first()
        
        if not user or not bcrypt.check_password_hash(user.password, data['password']):
            return jsonify({"error": "Invalid username or password"}), 401
        
        # Create access token
        access_token = create_access_token(identity=user.id)
        
        return jsonify({
            "message": "Login successful",
            "user": user.to_dict(),
            "access_token": access_token
        }), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/api/auth/me", methods=["GET"])
@jwt_required()
def get_current_user():
    """Get current authenticated user"""
    try:
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        
        if not user:
            return jsonify({"error": "User not found"}), 404
        
        return jsonify(user.to_dict()), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/api/auth/change-password", methods=["POST"])
def change_password():
    """Change password for current user (JWT optional for dev)"""
    try:
        data = request.get_json() or {}
        if not data.get('current_password') or not data.get('new_password'):
            return jsonify({"error": "current_password and new_password are required"}), 400

        # Try to get JWT identity, fallback to first user for testing
        try:
            current_user_id = get_jwt_identity()
        except Exception:
            user = User.query.first()
            if not user:
                return jsonify({"error": "No user found"}), 404
            current_user_id = user.id

        user = User.query.get(current_user_id)
        if not user:
            return jsonify({"error": "User not found"}), 404

        if not bcrypt.check_password_hash(user.password, data['current_password']):
            return jsonify({"error": "Current password is incorrect"}), 400

        hashed_password = bcrypt.generate_password_hash(data['new_password']).decode('utf-8')
        user.password = hashed_password
        db.session.commit()

        return jsonify({"message": "Password updated successfully"}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500


# Profile Routes

@app.route("/api/profile", methods=["GET"])
def get_profile():
    """Get user profile"""
    print("GET /api/profile called")
    try:
        # Try to get JWT identity, fallback to first user for testing
        try:
            current_user_id = get_jwt_identity()
            print(f"JWT identity: {current_user_id}")
        except Exception as jwt_err:
            print(f"JWT error: {jwt_err}, using first user for testing")
            user = User.query.first()
            if not user:
                return jsonify({"error": "No user found"}), 404
            current_user_id = user.id
        
        user = User.query.get(current_user_id)
        print(f"User: {user}")
        
        if not user:
            return jsonify({"error": "User not found"}), 404
        
        # Get or create profile
        profile = UserProfile.query.filter_by(user_id=current_user_id).first()
        print(f"Profile: {profile}")
        
        if not profile:
            print("Creating new profile")
            profile = UserProfile(user_id=current_user_id)
            db.session.add(profile)
            db.session.commit()
        
        # Build response without relying on to_dict to avoid serialization issues
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
        
        print(f"Returning profile: {response}")
        return jsonify(response), 200
        
    except Exception as e:
        db.session.rollback()
        print(f"Profile GET error: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({"error": f"Profile error: {str(e)}"}), 500


@app.route("/api/profile", methods=["PUT"])
@jwt_required()
def update_profile():
    """Update user profile"""
    try:
        current_user_id = get_jwt_identity()
        data = request.get_json()
        
        user = User.query.get(current_user_id)
        if not user:
            return jsonify({"error": "User not found"}), 404
        
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
        
        # Update profile fields
        if 'title' in data:
            profile.title = data['title']
        if 'location' in data:
            profile.location = data['location']
        if 'about' in data:
            profile.about = data['about']
        if 'photo' in data:
            profile.photo = data['photo']
        if 'phone' in data:
            profile.phone = data['phone']
        if 'website' in data:
            profile.website = data['website']
        if 'linkedIn' in data:
            profile.linkedin = data['linkedIn']
        if 'github' in data:
            profile.github = data['github']
        
        # Preferences
        if 'timezone' in data:
            profile.timezone = data['timezone']
        if 'language' in data:
            profile.language = data['language']
        if 'theme' in data:
            profile.theme = data['theme']
        if 'notificationEmail' in data:
            profile.notification_email = data['notificationEmail']
        if 'notificationPush' in data:
            profile.notification_push = data['notificationPush']
        
        # Security
        if 'twoFactorEnabled' in data:
            profile.two_factor_enabled = data['twoFactorEnabled']
        
        # Organization
        if 'teamName' in data:
            profile.team_name = data['teamName']
        if 'department' in data:
            profile.department = data['department']
        if 'role' in data:
            profile.role = data['role']
        if 'manager' in data:
            profile.manager = data['manager']
        
        # Signature & Assets
        if 'emailSignature' in data:
            profile.email_signature = data['emailSignature']
        if 'companyLogo' in data:
            profile.company_logo = data['companyLogo']
        if 'jobTemplate' in data:
            profile.job_template = data['jobTemplate']
        
        # Integrations
        if 'integrations' in data:
            profile.set_integrations(data['integrations'])
        
        # Permissions
        if 'accessLevel' in data:
            profile.access_level = data['accessLevel']
        if 'dataExportEnabled' in data:
            profile.data_export_enabled = data['dataExportEnabled']
        if 'gdprRetentionDays' in data:
            profile.gdpr_retention_days = data['gdprRetentionDays']
        
        # Saved Filters
        if 'savedFilters' in data:
            profile.set_saved_filters(data['savedFilters'])
        
        db.session.commit()
        
        profile_data = profile.to_dict()
        profile_data['fullName'] = user.full_name
        profile_data['email'] = user.email
        profile_data['company'] = user.company
        
        return jsonify({
            "message": "Profile updated successfully",
            "profile": profile_data
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

@app.route("/api/profile/two-factor", methods=["POST"])
def update_two_factor():
    """Enable or disable two-factor authentication (JWT optional for dev)"""
    try:
        data = request.get_json() or {}
        enabled = bool(data.get('enabled', False))

        # Try to get JWT identity, fallback to first user for testing
        try:
            current_user_id = get_jwt_identity()
        except Exception:
            user = User.query.first()
            if not user:
                return jsonify({"error": "No user found"}), 404
            current_user_id = user.id

        user = User.query.get(current_user_id)
        if not user:
            return jsonify({"error": "User not found"}), 404

        profile = UserProfile.query.filter_by(user_id=current_user_id).first()
        if not profile:
            profile = UserProfile(user_id=current_user_id)
            db.session.add(profile)

        profile.two_factor_enabled = enabled
        db.session.commit()

        return jsonify({"message": "Two-factor setting updated", "enabled": enabled}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500


# API Routes for React Frontend

@app.route("/api/upload", methods=["POST"])
def api_upload_resume():
    """Upload and parse resume with job matching"""
    try:
        resume_file = request.files.get("resume")
        jd_file = request.files.get("job_description")
        job_title = request.form.get("job_title", "")

        if not resume_file:
            return jsonify({"error": "No resume file uploaded"}), 400

        # Parse resume
        raw_text = parse_resume(resume_file)
        
        if not raw_text:
            return jsonify({"error": "Could not extract text from resume. Please ensure it's a valid PDF, DOCX, or TXT file."}), 400
        
        # Parse job description from PDF if provided
        job_description = ""
        if jd_file:
            job_description = parse_resume(jd_file)
            if not job_description:
                return jsonify({"error": "Could not extract text from job description PDF."}), 400
        
        cleaned = clean_text(raw_text)
        extracted_skills = extract_skills(cleaned)
        matched_skills = match_skills(extracted_skills)

        # Extract candidate information from resume
        extracted_name = extract_name(raw_text) or "Unknown"
        extracted_email = extract_email(raw_text) or "not-provided@email.com"
        extracted_phone = extract_phone(raw_text) or "Not provided"
        extracted_education = extract_education(raw_text)
        extracted_experience = extract_experience(raw_text)

        # Calculate job match score
        match_data = calculate_match_score(raw_text, job_description, job_title)

        # Generate resume data with extracted information
        resume_data = {
            "id": len(resumes_db) + 1,
            "name": extracted_name,
            "email": extracted_email,
            "phone": extracted_phone,
            "skills": extracted_skills or ["General"],
            "education": extracted_education,
            "experience": extracted_experience,
            "score": match_data["score"],
            "matchPercentage": match_data["match_percentage"],
            "matchedSkills": match_data["matched_skills"],
            "missingSkills": match_data["missing_skills"],
            "jobTitle": job_title,
            "uploadDate": datetime.now().strftime("%Y-%m-%d"),
            "rawText": raw_text
        }

        # Store in database
        resumes_db.append(resume_data)

        return jsonify(resume_data), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/api/resumes", methods=["GET"])
def api_get_resumes():
    """Get all parsed resumes"""
    return jsonify(resumes_db), 200


@app.route("/api/resumes/<int:resume_id>", methods=["GET"])
def api_get_resume(resume_id):
    """Get specific resume by ID"""
    resume = next((r for r in resumes_db if r["id"] == resume_id), None)
    if not resume:
        return jsonify({"error": "Resume not found"}), 404
    return jsonify(resume), 200


@app.route("/api/resumes/<int:resume_id>", methods=["DELETE"])
def api_delete_resume(resume_id):
    """Delete resume by ID"""
    global resumes_db
    resumes_db = [r for r in resumes_db if r["id"] != resume_id]
    return jsonify({"message": "Resume deleted successfully"}), 200


@app.route("/api/analytics", methods=["GET"])
def api_get_analytics():
    """Get analytics data"""
    if not resumes_db:
        return jsonify({
            "totalResumes": 0,
            "averageScore": 0,
            "topSkill": "N/A",
            "topMatch": 0
        }), 200

    # Calculate analytics
    total_resumes = len(resumes_db)
    avg_score = sum(r["score"] for r in resumes_db) / total_resumes
    top_match = max(r["matchPercentage"] for r in resumes_db)

    # Get top skill
    all_skills = {}
    for resume in resumes_db:
        for skill in resume.get("skills", []):
            all_skills[skill] = all_skills.get(skill, 0) + 1

    top_skill = max(all_skills.items(), key=lambda x: x[1])[0] if all_skills else "N/A"

    return jsonify({
        "totalResumes": total_resumes,
        "averageScore": round(avg_score, 1),
        "topSkill": top_skill,
        "topMatch": top_match,
        "skillsDistribution": all_skills
    }), 200


if __name__ == "__main__":
    app.run(debug=True, port=5000)

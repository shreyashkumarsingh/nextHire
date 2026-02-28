from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
import json

db = SQLAlchemy()

class User(db.Model):
    """User model for authentication"""
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)
    full_name = db.Column(db.String(120))
    company = db.Column(db.String(120))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        """Convert user object to dictionary"""
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'full_name': self.full_name,
            'company': self.company,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }
    
    def __repr__(self):
        return f'<User {self.username}>'


class UserProfile(db.Model):
    """Extended user profile model for detailed information"""
    __tablename__ = 'user_profiles'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), unique=True, nullable=False)
    
    # Basic Information
    title = db.Column(db.String(120), default='')
    location = db.Column(db.String(120), default='')
    about = db.Column(db.Text, default='')
    photo = db.Column(db.Text, default='')  # Base64 encoded image
    
    # Contact
    phone = db.Column(db.String(20), default='')
    website = db.Column(db.String(255), default='')
    linkedin = db.Column(db.String(255), default='')
    github = db.Column(db.String(255), default='')
    
    # Preferences
    timezone = db.Column(db.String(50), default='UTC')
    language = db.Column(db.String(50), default='English')
    theme = db.Column(db.String(20), default='System')
    notification_email = db.Column(db.Boolean, default=True)
    notification_push = db.Column(db.Boolean, default=True)
    
    # Security
    two_factor_enabled = db.Column(db.Boolean, default=False)
    
    # Organization
    team_name = db.Column(db.String(120), default='')
    department = db.Column(db.String(120), default='')
    role = db.Column(db.String(120), default='')
    manager = db.Column(db.String(120), default='')
    
    # Signature & Assets
    email_signature = db.Column(db.Text, default='')
    company_logo = db.Column(db.Text, default='')  # Base64 encoded image
    job_template = db.Column(db.Text, default='')
    
    # Integrations stored as JSON
    integrations = db.Column(db.Text, default='{}')
    
    # Permissions
    access_level = db.Column(db.String(50), default='Editor')
    data_export_enabled = db.Column(db.Boolean, default=True)
    gdpr_retention_days = db.Column(db.String(10), default='90')
    
    # Saved filters stored as JSON
    saved_filters = db.Column(db.Text, default='[]')
    
    # Metadata
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def set_integrations(self, integrations_dict):
        """Store integrations as JSON"""
        self.integrations = json.dumps(integrations_dict)
    
    def get_integrations(self):
        """Retrieve integrations from JSON"""
        try:
            return json.loads(self.integrations) if self.integrations else {}
        except:
            return {}
    
    def set_saved_filters(self, filters_list):
        """Store filters as JSON"""
        self.saved_filters = json.dumps(filters_list)
    
    def get_saved_filters(self):
        """Retrieve filters from JSON"""
        try:
            return json.loads(self.saved_filters) if self.saved_filters else []
        except:
            return []
    
    def to_dict(self):
        """Convert profile object to dictionary"""
        return {
            'id': self.id,
            'user_id': self.user_id,
            'title': self.title,
            'location': self.location,
            'about': self.about,
            'photo': self.photo,
            'phone': self.phone,
            'website': self.website,
            'linkedin': self.linkedin,
            'github': self.github,
            'timezone': self.timezone,
            'language': self.language,
            'theme': self.theme,
            'notificationEmail': self.notification_email,
            'notificationPush': self.notification_push,
            'twoFactorEnabled': self.two_factor_enabled,
            'teamName': self.team_name,
            'department': self.department,
            'role': self.role,
            'manager': self.manager,
            'emailSignature': self.email_signature,
            'companyLogo': self.company_logo,
            'jobTemplate': self.job_template,
            'integrations': self.get_integrations(),
            'accessLevel': self.access_level,
            'dataExportEnabled': self.data_export_enabled,
            'gdprRetentionDays': self.gdpr_retention_days,
            'savedFilters': self.get_saved_filters(),
            'updatedAt': self.updated_at.isoformat() if self.updated_at else None
        }
    
    def __repr__(self):
        return f'<UserProfile user_id={self.user_id}>'


class Resume(db.Model):
    """Resume model for storing parsed resume data"""
    __tablename__ = 'resumes'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    
    # Candidate Information
    name = db.Column(db.String(120), nullable=False)
    email = db.Column(db.String(120))
    phone = db.Column(db.String(50))
    
    # File Information
    filename = db.Column(db.String(255), nullable=False)
    file_path = db.Column(db.String(500))
    file_size = db.Column(db.Integer)
    
    # Job Information
    job_title = db.Column(db.String(200))
    job_description = db.Column(db.Text)
    
    # Scoring
    score = db.Column(db.Integer, default=0)
    match_percentage = db.Column(db.Integer, default=0)
    
    # Raw Data
    raw_text = db.Column(db.Text)
    parsed_data = db.Column(db.Text)  # JSON string of all parsed data
    
    # Timestamps
    uploaded_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Status
    status = db.Column(db.String(50), default='active')  # active, archived, deleted
    
    # Relationships
    user = db.relationship('User', backref='resumes')
    skills = db.relationship('ResumeSkill', backref='resume', cascade='all, delete-orphan')
    education = db.relationship('Education', backref='resume', cascade='all, delete-orphan')
    experience = db.relationship('Experience', backref='resume', cascade='all, delete-orphan')
    
    def set_parsed_data(self, data_dict):
        """Store parsed data as JSON"""
        self.parsed_data = json.dumps(data_dict)
    
    def get_parsed_data(self):
        """Retrieve parsed data from JSON"""
        try:
            return json.loads(self.parsed_data) if self.parsed_data else {}
        except:
            return {}
    
    def to_dict(self):
        """Convert resume object to dictionary"""
        return {
            'id': self.id,
            'name': self.name,
            'email': self.email,
            'phone': self.phone,
            'filename': self.filename,
            'jobTitle': self.job_title,
            'score': self.score,
            'matchPercentage': self.match_percentage,
            'uploadDate': self.uploaded_at.strftime('%Y-%m-%d') if self.uploaded_at else None,
            'status': self.status,
            'skills': [skill.to_dict() for skill in self.skills],
            'education': [edu.to_dict() for edu in self.education],
            'experience': [exp.to_dict() for exp in self.experience],
            'rawText': self.raw_text,
            'matchedSkills': [s.skill_name for s in self.skills if s.is_matched],
            'missingSkills': [s.skill_name for s in self.skills if not s.is_matched]
        }
    
    def __repr__(self):
        return f'<Resume {self.name}>'


class ResumeSkill(db.Model):
    """Skills extracted from resume"""
    __tablename__ = 'resume_skills'
    
    id = db.Column(db.Integer, primary_key=True)
    resume_id = db.Column(db.Integer, db.ForeignKey('resumes.id'), nullable=False)
    skill_name = db.Column(db.String(100), nullable=False)
    is_matched = db.Column(db.Boolean, default=False)  # Matched with job description
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.skill_name,
            'isMatched': self.is_matched
        }
    
    def __repr__(self):
        return f'<ResumeSkill {self.skill_name}>'


class Education(db.Model):
    """Education history from resume"""
    __tablename__ = 'education'
    
    id = db.Column(db.Integer, primary_key=True)
    resume_id = db.Column(db.Integer, db.ForeignKey('resumes.id'), nullable=False)
    degree = db.Column(db.String(200))
    institution = db.Column(db.String(200))
    year = db.Column(db.String(50))
    field_of_study = db.Column(db.String(200))
    
    def to_dict(self):
        return {
            'id': self.id,
            'degree': self.degree,
            'institution': self.institution,
            'year': self.year,
            'fieldOfStudy': self.field_of_study
        }
    
    def __repr__(self):
        return f'<Education {self.degree}>'


class Experience(db.Model):
    """Work experience from resume"""
    __tablename__ = 'experience'
    
    id = db.Column(db.Integer, primary_key=True)
    resume_id = db.Column(db.Integer, db.ForeignKey('resumes.id'), nullable=False)
    title = db.Column(db.String(200))
    company = db.Column(db.String(200))
    duration = db.Column(db.String(100))
    description = db.Column(db.Text)
    start_date = db.Column(db.String(50))
    end_date = db.Column(db.String(50))
    
    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'company': self.company,
            'duration': self.duration,
            'description': self.description
        }
    
    def __repr__(self):
        return f'<Experience {self.title}>'

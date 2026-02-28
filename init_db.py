"""
Database migration and initialization script
Run this to create/update database tables
"""
from app_production import app, db
from models import User, UserProfile, Resume, ResumeSkill, Education, Experience

def init_db():
    """Initialize database with all tables"""
    with app.app_context():
        print("Creating database tables...")
        db.create_all()
        print("✓ Database tables created successfully!")
        
        # Print created tables
        print("\nCreated tables:")
        print("- users")
        print("- user_profiles")
        print("- resumes")
        print("- resume_skills")
        print("- education")
        print("- experience")


def drop_db():
    """Drop all database tables (WARNING: Deletes all data)"""
    response = input("⚠️  WARNING: This will delete ALL data. Type 'YES' to confirm: ")
    if response == 'YES':
        with app.app_context():
            print("Dropping all tables...")
            db.drop_all()
            print("✓ All tables dropped!")
    else:
        print("Operation cancelled.")


def reset_db():
    """Drop and recreate all tables"""
    response = input("⚠️  WARNING: This will delete ALL data and recreate tables. Type 'YES' to confirm: ")
    if response == 'YES':
        with app.app_context():
            print("Dropping all tables...")
            db.drop_all()
            print("Creating new tables...")
            db.create_all()
            print("✓ Database reset successfully!")
    else:
        print("Operation cancelled.")


if __name__ == '__main__':
    import sys
    
    if len(sys.argv) < 2:
        print("Usage:")
        print("  python init_db.py init    - Create all tables")
        print("  python init_db.py drop    - Drop all tables")
        print("  python init_db.py reset   - Drop and recreate tables")
    else:
        command = sys.argv[1].lower()
        
        if command == 'init':
            init_db()
        elif command == 'drop':
            drop_db()
        elif command == 'reset':
            reset_db()
        else:
            print(f"Unknown command: {command}")

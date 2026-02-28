#!/usr/bin/env python3
"""
Database backup script for NextHire
Creates backups of SQLite database or PostgreSQL
"""
import os
import sys
import shutil
from datetime import datetime
import subprocess

# Configuration
BACKUP_DIR = 'backups'
DATABASE_PATH = 'instance/nexthire.db'  # SQLite path
MAX_BACKUPS = 30  # Keep last 30 backups

def ensure_backup_dir():
    """Create backup directory if it doesn't exist"""
    if not os.path.exists(BACKUP_DIR):
        os.makedirs(BACKUP_DIR)
        print(f"✓ Created backup directory: {BACKUP_DIR}")

def backup_sqlite():
    """Backup SQLite database"""
    if not os.path.exists(DATABASE_PATH):
        print(f"✗ Database not found: {DATABASE_PATH}")
        return False
    
    timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
    backup_filename = f"nexthire_backup_{timestamp}.db"
    backup_path = os.path.join(BACKUP_DIR, backup_filename)
    
    try:
        shutil.copy2(DATABASE_PATH, backup_path)
        file_size = os.path.getsize(backup_path) / 1024  # KB
        print(f"✓ SQLite backup created: {backup_filename} ({file_size:.2f} KB)")
        return True
    except Exception as e:
        print(f"✗ Backup failed: {str(e)}")
        return False

def backup_postgresql():
    """Backup PostgreSQL database"""
    load_dotenv()
    db_url = os.getenv('DATABASE_URL', '')
    
    if 'postgresql' not in db_url:
        print("✗ PostgreSQL connection string not found in DATABASE_URL")
        return False
    
    # Parse connection string
    # Format: postgresql://user:password@host:port/database
    try:
        from urllib.parse import urlparse
        parsed = urlparse(db_url)
        
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        backup_filename = f"nexthire_backup_{timestamp}.sql"
        backup_path = os.path.join(BACKUP_DIR, backup_filename)
        
        # Set environment variables for pg_dump
        env = os.environ.copy()
        env['PGPASSWORD'] = parsed.password
        
        # Run pg_dump
        cmd = [
            'pg_dump',
            '-h', parsed.hostname,
            '-p', str(parsed.port or 5432),
            '-U', parsed.username,
            '-d', parsed.path.lstrip('/'),
            '-f', backup_path,
            '--format=plain',
            '--no-owner',
            '--no-acl'
        ]
        
        subprocess.run(cmd, env=env, check=True)
        
        file_size = os.path.getsize(backup_path) / 1024  # KB
        print(f"✓ PostgreSQL backup created: {backup_filename} ({file_size:.2f} KB)")
        return True
        
    except Exception as e:
        print(f"✗ PostgreSQL backup failed: {str(e)}")
        return False

def cleanup_old_backups():
    """Remove old backups, keeping only the most recent MAX_BACKUPS"""
    try:
        backups = sorted([
            f for f in os.listdir(BACKUP_DIR)
            if f.startswith('nexthire_backup_')
        ])
        
        if len(backups) > MAX_BACKUPS:
            to_delete = backups[:-MAX_BACKUPS]
            for backup in to_delete:
                os.remove(os.path.join(BACKUP_DIR, backup))
                print(f"✓ Removed old backup: {backup}")
            
            print(f"✓ Cleanup complete. Kept {MAX_BACKUPS} most recent backups")
    except Exception as e:
        print(f"✗ Cleanup failed: {str(e)}")

def main():
    """Main backup function"""
    print("=" * 60)
    print("NextHire Database Backup")
    print("=" * 60)
    print(f"Timestamp: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print()
    
    ensure_backup_dir()
    
    # Determine database type
    from dotenv import load_dotenv
    load_dotenv()
    db_url = os.getenv('DATABASE_URL', 'sqlite:///nexthire.db')
    
    if 'postgresql' in db_url:
        print("Database type: PostgreSQL")
        success = backup_postgresql()
    else:
        print("Database type: SQLite")
        success = backup_sqlite()
    
    if success:
        cleanup_old_backups()
        print()
        print("=" * 60)
        print("✓ Backup completed successfully")
        print("=" * 60)
        return 0
    else:
        print()
        print("=" * 60)
        print("✗ Backup failed")
        print("=" * 60)
        return 1

if __name__ == '__main__':
    sys.exit(main())

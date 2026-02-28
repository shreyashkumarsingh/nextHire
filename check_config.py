#!/usr/bin/env python3
"""
Production Configuration Validator
Ensures all required environment variables are set before deployment
Run this before deploying to production: python check_config.py
"""

import os
import sys
from dotenv import load_dotenv
from pathlib import Path

# Load environment variables
env_file = '.env.production' if os.getenv('FLASK_ENV') == 'production' else '.env'
if Path(env_file).exists():
    load_dotenv(env_file)

# Color codes for output
GREEN = '\033[92m'
RED = '\033[91m'
YELLOW = '\033[93m'
BLUE = '\033[94m'
RESET = '\033[0m'

def print_header(text):
    print(f"\n{BLUE}{'='*60}")
    print(f"{text}")
    print(f"{'='*60}{RESET}\n")

def print_error(text):
    print(f"{RED}✗ {text}{RESET}")

def print_success(text):
    print(f"{GREEN}✓ {text}{RESET}")

def print_warning(text):
    print(f"{YELLOW}⚠ {text}{RESET}")

def check_env_var(var_name, required=True, descriptions="", production_only=False):
    """Check if environment variable exists and is valid"""
    env = os.getenv('FLASK_ENV', 'development')
    
    # Skip production-only checks if not in production
    if production_only and env != 'production':
        return True
    
    value = os.getenv(var_name)
    
    # Check if required variable is missing
    if required and not value:
        print_error(f"{var_name} is not set. {descriptions}")
        return False
    
    # Check for placeholder/dummy values
    if value and (
        value.startswith('your-') or 
        value.startswith('dev-') or 
        value == 'change-in-production' or
        value.startswith('<') or
        value.startswith('CHANGE-ME')
    ):
        print_error(f"{var_name} is set to a placeholder value: {value}")
        return False
    
    if value:
        # Mask sensitive values in output
        masked_value = value[:20] + '...' if len(value) > 20 else value
        print_success(f"{var_name} is set")
    
    return True

def main():
    print_header("NextHire Production Configuration Validator")
    
    all_valid = True
    env = os.getenv('FLASK_ENV', 'development')
    
    print(f"Environment: {BLUE}{env.upper()}{RESET}")
    
    # CRITICAL VARIABLES
    print_header("🔴 CRITICAL VARIABLES (Must be set)")
    
    critical_vars = {
        'FLASK_ENV': 'Flask environment (development/production)',
        'FLASK_DEBUG': 'Flask debug mode (should be False in production)',
        'SECRET_KEY': 'Flask secret key for sessions. Generate: python -c "import secrets; print(secrets.token_urlsafe(32))"',
        'JWT_SECRET_KEY': 'JWT secret key. Generate: python -c "import secrets; print(secrets.token_urlsafe(32))"',
        'DATABASE_URL': 'Database connection URL (use PostgreSQL in production)',
    }
    
    for var, description in critical_vars.items():
        if not check_env_var(var, required=True, descriptions=description):
            all_valid = False
    
    # PRODUCTION VARIABLES
    print_header("🟡 PRODUCTION SPECIFIC")
    
    if env == 'production':
        prod_vars = {
            'CORS_ORIGINS': 'CORS allowed origins (e.g., https://yourdomain.com)',
            'RATELIMIT_STORAGE_URL': 'Redis URL for rate limiting (e.g., redis://redis:6379/1)',
        }
        
        for var, description in prod_vars.items():
            if not check_env_var(var, required=True, descriptions=description, production_only=True):
                all_valid = False
    
    # OPTIONAL VARIABLES
    print_header("🟠 OPTIONAL VARIABLES")
    
    optional_vars = {
        'REDIS_URL': 'Redis connection URL for caching (optional)',
        'AWS_S3_BUCKET': 'AWS S3 bucket for file storage (optional, uses local if not set)',
        'MAIL_SERVER': 'SMTP server for email (optional)',
        'LOG_LEVEL': 'Logging level (default: INFO)',
    }
    
    for var, description in optional_vars.items():
        value = os.getenv(var)
        if value:
            print_success(f"{var} is configured")
        else:
            print_warning(f"{var} is not configured (optional)")
    
    # CONFIGURATION CHECKS
    print_header("🔧 CONFIGURATION CHECKS")
    
    # Check DEBUG mode in production
    if env == 'production':
        debug = os.getenv('FLASK_DEBUG', 'False').lower() == 'true'
        if debug:
            print_error("FLASK_DEBUG is enabled in production - disable for security!")
            all_valid = False
        else:
            print_success("FLASK_DEBUG is disabled in production")
    
    # Check database type
    db_url = os.getenv('DATABASE_URL', '')
    if env == 'production':
        if 'sqlite' in db_url.lower():
            print_error("SQLite is being used in production - use PostgreSQL instead!")
            all_valid = False
        elif 'postgresql' in db_url.lower() or 'postgres' in db_url.lower():
            print_success("PostgreSQL is configured for production")
        else:
            print_warning("Database type could not be determined")
    
    # Check SECRET_KEY strength
    secret = os.getenv('SECRET_KEY', '')
    if secret and len(secret) < 32:
        print_error(f"SECRET_KEY is too short ({len(secret)} chars). Use at least 32 characters.")
        all_valid = False
    elif secret:
        print_success(f"SECRET_KEY appears strong ({len(secret)} chars)")
    
    # Final summary
    print_header("SUMMARY")
    
    if all_valid and env == 'production':
        print(f"{GREEN}{'='*60}")
        print(f"✓ All production configuration checks passed!")
        print(f"✓ Ready for deployment")
        print(f"{'='*60}{RESET}\n")
        return 0
    elif all_valid:
        print(f"{GREEN}✓ Configuration looks good for development{RESET}\n")
        return 0
    else:
        print(f"{RED}{'='*60}")
        print(f"✗ Configuration validation failed!")
        print(f"✗ Please fix the errors above before deploying")
        print(f"{'='*60}{RESET}\n")
        return 1

if __name__ == '__main__':
    sys.exit(main())

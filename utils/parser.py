import fitz  # PyMuPDF
import docx
from werkzeug.utils import secure_filename
import os
import tempfile
import re


def parse_resume(file):
    """
    Parse resume file and extract text
    Handles PDF, DOCX, and TXT files
    """
    if not file:
        return ""
    
    # Get file extension
    filename = secure_filename(file.filename)
    file_ext = os.path.splitext(filename)[1].lower()
    
    # Create temporary file
    with tempfile.NamedTemporaryFile(delete=False, suffix=file_ext) as tmp_file:
        file.save(tmp_file.name)
        temp_path = tmp_file.name
    
    try:
        if file_ext == '.pdf':
            text = extract_text_from_pdf(temp_path)
        elif file_ext == '.docx':
            text = extract_text_from_docx(temp_path)
        elif file_ext == '.txt':
            with open(temp_path, 'r', encoding='utf-8', errors='ignore') as f:
                text = f.read()
        else:
            text = ""
    finally:
        # Clean up temporary file
        try:
            os.unlink(temp_path)
        except:
            pass
    
    return text


def extract_email(text):
    """Extract email from resume text"""
    email_pattern = r'[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}'
    match = re.search(email_pattern, text)
    return match.group(0) if match else None


def extract_phone(text):
    """Extract phone number from resume text"""
    # Common phone patterns
    phone_patterns = [
        r'\+1\s?\(?(\d{3})\)?[-.\s]?(\d{3})[-.\s]?(\d{4})',  # +1 format
        r'\(?(\d{3})\)?[-.\s]?(\d{3})[-.\s]?(\d{4})',  # (xxx) xxx-xxxx
        r'\+91\s?(\d{5})\s?(\d{5})',  # India +91 format
        r'\+91[-.\s]?(\d{10})',  # India +91 without spaces
        r'\d{10}',  # 10 digit number
    ]
    
    for pattern in phone_patterns:
        match = re.search(pattern, text)
        if match:
            return match.group(0)
    
    return None


def extract_name(text):
    """Extract name from resume text"""
    # Split by newlines/lines and try to get the first meaningful name
    lines = text.split('\n')
    
    for line in lines:
        line = line.strip()
        # Skip empty lines and common headers
        if not line or line.lower() in ['resume', 'cv', 'curriculum vitae']:
            continue
        
        # Simple heuristic: first line with 2-4 words (likely a name)
        words = line.split()
        if 2 <= len(words) <= 4:
            # Check if it contains mostly letters
            name_text = ' '.join(words)
            if re.match(r'^[a-zA-Z\s\.]+$', name_text):
                return name_text
    
    return "Unknown"


def extract_education(text):
    """Extract the full education block from resume text without splitting it."""
    lines = [line.strip() for line in text.splitlines()]

    section_titles = {
        'education',
        'academic background',
        'academic details',
        'education details',
        'educational qualification',
        'qualifications'
    }
    stop_sections = {
        'objective',
        'summary',
        'professional summary',
        'experience',
        'work experience',
        'employment',
        'skills',
        'technical skills',
        'projects',
        'certifications',
        'certification',
        'achievements',
        'publications',
        'interests',
        'languages'
    }

    def normalize_heading(line):
        return re.sub(r'[^a-z\s]', '', line.lower()).strip()

    def is_stop_heading(line):
        return normalize_heading(line) in stop_sections

    def extract_year(block_lines):
        for entry_line in block_lines:
            match = re.search(r'((?:19|20)\d{2}\s*[-–]\s*(?:present|current|(?:19|20)\d{2}))', entry_line, re.IGNORECASE)
            if match:
                return match.group(1)
        for entry_line in block_lines:
            match = re.search(r'\b(?:19|20)\d{2}\b', entry_line)
            if match:
                return match.group(0)
        return 'N/A'

    education_start = None
    for index, line in enumerate(lines):
        normalized = normalize_heading(line)
        if normalized in section_titles:
            education_start = index + 1
            break

    section_lines = []
    if education_start is not None:
        for line in lines[education_start:]:
            if is_stop_heading(line):
                break
            section_lines.append(line)
    else:
        section_lines = lines

    filtered_lines = [line for line in section_lines if line]
    if not filtered_lines:
        return [{
            'degree': 'Education information not found',
            'institution': 'N/A',
            'year': 'N/A',
            'text': 'Education information not found'
        }]

    full_text = '\n'.join(filtered_lines)
    return [{
        'degree': filtered_lines[0],
        'institution': '',
        'year': extract_year(filtered_lines),
        'text': full_text
    }]


def extract_experience(text):
    """Extract experience/work history from resume text"""
    experience_list = []
    lines = text.split('\n')
    
    # Keywords that indicate work experience section
    experience_keywords = ['experience', 'work history', 'employment', 'professional experience']
    in_experience_section = False
    current_job = {}
    
    for i, line in enumerate(lines):
        line_lower = line.lower()
        line_stripped = line.strip()
        
        # Check if we're entering experience section
        if any(keyword in line_lower for keyword in experience_keywords):
            in_experience_section = True
            continue
        
        # Check if we've moved to another section
        if in_experience_section and any(keyword in line_lower for keyword in 
                                        ['education', 'skills', 'projects', 'certification']):
            if current_job:
                experience_list.append(current_job)
            in_experience_section = False
            current_job = {}
        
        if in_experience_section and line_stripped:
            # Look for date patterns (YYYY - YYYY or YYYY-Present)
            date_pattern = r'(\d{4})\s*[-–]\s*(?:(present|current|\d{4}))?'
            date_match = re.search(date_pattern, line)
            
            if date_match:
                # This might be a new job entry
                if current_job:
                    experience_list.append(current_job)
                
                current_job = {
                    "title": "Job Title",
                    "company": "Company",
                    "duration": date_match.group(0),
                    "description": line_stripped
                }
                
                # Try to extract job title and company from the line
                text_before_date = line[:date_match.start()].strip()
                if text_before_date:
                    # Assume format: "Title at Company" or "Title - Company"
                    if ' at ' in text_before_date.lower():
                        parts = text_before_date.split(' at ')
                        current_job["title"] = parts[0].strip()
                        current_job["company"] = parts[1].strip() if len(parts) > 1 else "Company"
                    elif '-' in text_before_date:
                        parts = text_before_date.split('-')
                        current_job["title"] = parts[0].strip()
                        current_job["company"] = parts[1].strip() if len(parts) > 1 else "Company"
            elif current_job and line_stripped:
                # Accumulate description
                if "description" in current_job:
                    current_job["description"] += " " + line_stripped
    
    # Don't forget the last job
    if current_job:
        experience_list.append(current_job)
    
    return experience_list if experience_list else [{
        "title": "Experience information not found",
        "company": "N/A",
        "duration": "N/A",
        "description": "Review raw text for details"
    }]


def extract_text(file_path):
    """
    Extract text from PDF or DOCX file
    """

    if file_path.endswith(".pdf"):
        return extract_text_from_pdf(file_path)

    elif file_path.endswith(".docx"):
        return extract_text_from_docx(file_path)

    else:
        return "Unsupported file format"


def extract_text_from_pdf(file_path):
    text = ""
    doc = fitz.open(file_path)

    for page in doc:
        text += page.get_text()

    return text


def extract_text_from_docx(file_path):
    doc = docx.Document(file_path)
    text = "\n".join([para.text for para in doc.paragraphs])
    return text

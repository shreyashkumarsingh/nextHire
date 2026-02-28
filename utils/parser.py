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
    """Extract education information from resume text"""
    education_list = []
    lines = text.split('\n')
    
    # More comprehensive degree patterns
    degree_keywords = ['bachelor', 'master', 'phd', 'degree', 'diploma', 'b.s.', 'b.tech', 'm.tech',
                       'b.sc', 'm.sc', 'b.a', 'm.a', 'bca', 'mca', 'engineering', 'b.e', 'm.e',
                       'b.com', 'm.com']
    
    # University keywords - excluding generic words that might match degree names
    university_keywords = ['university', 'college', 'institute', 'school', 'iit', 'delhi', 'mumbai',
                          'bangalore', 'hyderabad', 'pune', 'trinity', 'oxford', 'cambridge', 'stanford',
                          'harvard', 'mit', 'nit', 'national institute', 'central', 'kiit']
    
    found_education = []
    
    # Look for lines that contain degree keywords
    for idx, line in enumerate(lines):
        line_lower = line.lower().strip()
        if not line_lower or len(line_lower) < 3:
            continue
        
        # Check if line contains any degree keyword
        has_degree_keyword = any(deg in line_lower for deg in degree_keywords)
        
        if has_degree_keyword:
            # Extract year if present anywhere in the education block (current or nearby lines)
            year = 'N/A'
            # Check current line for year
            year_match = re.search(r'\b(19|20)\d{2}\b', line)
            if year_match:
                year = year_match.group(0)
            # Check next few lines for year if not found yet
            if year == 'N/A':
                for check_idx in range(idx + 1, min(idx + 4, len(lines))):
                    year_match = re.search(r'\b(19|20)\d{2}\b', lines[check_idx])
                    if year_match:
                        year = year_match.group(0)
                        break
            
            # Look for institution name in nearby lines
            institution = 'N/A'
            
            # First, check if current line itself contains institution keywords
            has_university_current = any(univ in line_lower for univ in university_keywords)
            
            if has_university_current:
                # Current line has institution info (like "B.Tech from University Name")
                institution = line.strip()
            else:
                # Look in nearby lines (next 3 lines) for institution
                for check_idx in range(idx + 1, min(idx + 4, len(lines))):
                    check_line = lines[check_idx].lower().strip()
                    
                    # Skip empty lines
                    if not check_line or len(check_line) < 3:
                        continue
                    
                    # Skip if this is another degree line
                    if any(deg in check_line for deg in degree_keywords):
                        continue
                    
                    # Check if this line has university keywords
                    has_university = any(univ in check_line for univ in university_keywords)
                    
                    if has_university:
                        institution = lines[check_idx].strip()
                        break
                    elif institution == 'N/A' and check_idx == idx + 1:
                        # If next line doesn't have degree or year, assume it's institution
                        has_year = re.search(r'\b(19|20)\d{2}\b', lines[check_idx])
                        if not has_year and len(lines[check_idx].strip()) > 3:
                            institution = lines[check_idx].strip()
                            break
            
            # Extract degree type
            degree_type = 'Degree'
            if any(m in line_lower for m in ['master', 'm.', 'm_']):
                degree_type = 'Master'
            elif any(b in line_lower for b in ['bachelor', 'b.', 'b_']):
                degree_type = 'Bachelor'
            elif 'phd' in line_lower:
                degree_type = 'PhD'
            elif 'diploma' in line_lower:
                degree_type = 'Diploma'
            
            edu_item = {
                "degree": degree_type,
                "institution": institution,
                "year": year
            }
            
            # Avoid duplicates
            if edu_item not in found_education:
                found_education.append(edu_item)
    
    return found_education if found_education else [{
        "degree": "Education information not found",
        "institution": "N/A",
        "year": "N/A"
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

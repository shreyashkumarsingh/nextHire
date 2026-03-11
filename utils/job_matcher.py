import re
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
import nltk

# Download stopwords if not available
try:
    stopwords.words('english')
except LookupError:
    nltk.download('stopwords')
    nltk.download('punkt')


def calculate_match_score(resume_text, job_description, job_title=''):
    """
    Calculate comprehensive ATS match score between resume and job description
    
    Args:
        resume_text: Full resume text
        job_description: Job description text
        job_title: Job title
        
    Returns:
        dict with weighted score and detailed breakdown
    """
    
    if not job_description or not resume_text:
        return {"score": 0, "match_percentage": 0, "matched_skills": [], "missing_skills": [], "breakdown": {"skills": 0, "education": 0, "experience": 0, "keywords": 0}}
    
    # Convert to lowercase
    resume_lower = resume_text.lower()
    job_lower = job_description.lower()
    
    # 1. SKILLS MATCHING (40% weight)
    skills_score, matched_skills, missing_skills = calculate_skills_match(resume_lower, job_lower)
    
    # 2. EDUCATION MATCHING (30% weight)
    education_score = calculate_education_match(resume_lower, job_lower)
    
    # 3. EXPERIENCE MATCHING (20% weight)
    experience_score = calculate_experience_match(resume_lower, job_lower)
    
    # 4. KEYWORD RELEVANCE (10% weight)
    keyword_score = calculate_keyword_match(resume_lower, job_lower)
    
    # Calculate weighted ATS score (0-100)
    ats_score = int(
        (skills_score * 0.40) +
        (education_score * 0.30) +
        (experience_score * 0.20) +
        (keyword_score * 0.10)
    )
    
    # Calculate overall match percentage (pure skill-based, distinct from weighted ATS score)
    match_percentage = skills_score
    
    # Ensure scores are within 0-100 range
    ats_score = max(0, min(100, ats_score))
    match_percentage = max(0, min(100, match_percentage))
    
    return {
        "score": ats_score,
        "match_percentage": match_percentage,
        "matched_skills": matched_skills[:15],
        "missing_skills": missing_skills[:15],
        "job_title": job_title,
        "breakdown": {
            "skills": skills_score,
            "education": education_score,
            "experience": experience_score,
            "keywords": keyword_score
        }
    }


def calculate_skills_match(resume_text, job_text):
    """
    Calculate skills matching score (0-100)
    Returns: score, matched_skills, missing_skills
    """
    # Technical skills database
    tech_skills = [
        # Programming Languages
        'python', 'java', 'javascript', 'typescript', 'c++', 'c#', 'go', 'rust', 'php', 'ruby',
        'swift', 'kotlin', 'scala', 'r', 'matlab', 'perl', 'shell', 'bash',
        # Web Technologies
        'react', 'angular', 'vue', 'svelte', 'nextjs', 'nodejs', 'express', 'django', 
        'flask', 'fastapi', 'spring', 'laravel', 'html', 'css', 'sass', 'less',
        'bootstrap', 'tailwind', 'material ui', 'webpack', 'vite', 'redux', 'graphql',
        # Databases
        'sql', 'nosql', 'mongodb', 'postgresql', 'mysql', 'redis', 'cassandra',
        'dynamodb', 'firebase', 'elasticsearch', 'oracle', 'sqlite',
        # Cloud & DevOps
        'aws', 'azure', 'gcp', 'docker', 'kubernetes', 'jenkins', 'terraform',
        'ansible', 'circleci', 'travis', 'gitlab', 'ci/cd', 'microservices',
        # Tools & Frameworks
        'git', 'github', 'jira', 'confluence', 'linux', 'unix', 'agile', 'scrum',
        'rest api', 'soap', 'junit', 'pytest', 'selenium', 'postman',
        # Data & ML
        'machine learning', 'deep learning', 'tensorflow', 'pytorch', 'keras',
        'scikit-learn', 'pandas', 'numpy', 'data analysis', 'data science',
        'power bi', 'tableau', 'excel', 'spark', 'hadoop', 'kafka',
        # Mobile
        'android', 'ios', 'react native', 'flutter', 'xamarin',
        # Other
        'security', 'testing', 'qa', 'automation', 'performance', 'api',
        'oop', 'design patterns', 'solid', 'tdd', 'bdd'
    ]
    
    # Extract skills mentioned in job description
    job_skills = []
    for skill in tech_skills:
        if skill in job_text:
            job_skills.append(skill)
    
    # If no specific skills found, extract important words
    if len(job_skills) < 3:
        job_skills.extend(extract_important_words(job_text)[:10])
    
    # Find matched skills in resume
    matched = []
    for skill in job_skills:
        if skill in resume_text:
            matched.append(skill)
    
    # Find missing skills
    missing = [skill for skill in job_skills if skill not in matched]
    
    # Calculate score
    if len(job_skills) > 0:
        score = int((len(matched) / len(job_skills)) * 100)
    else:
        score = 50
    
    return score, matched, missing


def calculate_education_match(resume_text, job_text):
    """
    Calculate education matching score (0-100)
    """
    education_levels = {
        'phd': 5,
        'doctorate': 5,
        'master': 4,
        'm.tech': 4,
        'm.sc': 4,
        'm.s': 4,
        'mba': 4,
        'bachelor': 3,
        'b.tech': 3,
        'b.sc': 3,
        'b.s': 3,
        'b.e': 3,
        'diploma': 2,
        'high school': 1,
        'secondary': 1
    }
    
    # Find required education level from JD
    required_level = 0
    for edu, level in education_levels.items():
        if edu in job_text:
            required_level = max(required_level, level)
    
    # Find candidate's education level
    candidate_level = 0
    for edu, level in education_levels.items():
        if edu in resume_text:
            candidate_level = max(candidate_level, level)
    
    # Calculate score
    if required_level == 0:
        # No specific education requirement mentioned
        return 85 if candidate_level >= 3 else 70
    elif candidate_level >= required_level:
        # Meets or exceeds requirement
        return 100
    elif candidate_level == required_level - 1:
        # One level below
        return 70
    elif candidate_level > 0:
        # Has some education but below requirement
        return 50
    else:
        # No education information found
        return 30


def calculate_experience_match(resume_text, job_text):
    """
    Calculate experience matching score (0-100)
    """
    # Extract required years from job description
    required_years = 0
    
    # Patterns like "5+ years", "3-5 years", "minimum 2 years"
    exp_patterns = [
        r'(\d+)\+?\s*(?:years?|yrs?)',
        r'(\d+)\s*[-to]+\s*\d+\s*(?:years?|yrs?)',
        r'minimum\s+(\d+)\s*(?:years?|yrs?)',
        r'at least\s+(\d+)\s*(?:years?|yrs?)'
    ]
    
    for pattern in exp_patterns:
        match = re.search(pattern, job_text)
        if match:
            years = int(match.group(1))
            required_years = max(required_years, years)
    
    # Extract candidate's experience from resume
    candidate_years = 0
    
    # Look for date ranges in resume (YYYY-YYYY format)
    date_ranges = re.findall(r'(\d{4})\s*[-–]\s*(?:(present|current|\d{4}))', resume_text)
    
    for start, end in date_ranges:
        start_year = int(start)
        end_year = 2026 if end.lower() in ['present', 'current'] else int(end)
        years = end_year - start_year
        candidate_years += years
    
    # Also look for explicit "X years of experience" mentions
    exp_mention = re.search(r'(\d+)\+?\s*(?:years?|yrs?)\s+(?:of\s+)?experience', resume_text)
    if exp_mention:
        mentioned_years = int(exp_mention.group(1))
        candidate_years = max(candidate_years, mentioned_years)
    
    # Calculate score
    if required_years == 0:
        # No specific requirement
        return 80 if candidate_years >= 2 else 60
    elif candidate_years >= required_years:
        # Meets or exceeds requirement
        return 100
    elif candidate_years >= required_years * 0.7:
        # Within 70% of requirement
        return 80
    elif candidate_years >= required_years * 0.5:
        # Within 50% of requirement
        return 60
    elif candidate_years > 0:
        # Has some experience
        return 40
    else:
        # No clear experience found
        return 20


def calculate_keyword_match(resume_text, job_text):
    """
    Calculate overall keyword/context relevance (0-100)
    """
    # Extract important keywords from job description
    job_keywords = extract_important_words(job_text)
    
    if len(job_keywords) == 0:
        return 50
    
    # Count how many appear in resume
    matched = sum(1 for keyword in job_keywords if keyword in resume_text)
    
    # Calculate percentage
    score = int((matched / len(job_keywords)) * 100)
    
    return min(100, score)


def extract_important_words(text):
    """Extract important non-stopword terms from text"""
    if not text:
        return []
    
    # Remove special characters but keep alphanumeric
    text_clean = re.sub(r'[^a-z0-9\s]', ' ', text.lower())
    
    # Extract words of 4+ characters
    words = re.findall(r'\b[a-z]{4,}\b', text_clean)
    
    # Remove stopwords
    stop_words = set(stopwords.words('english'))
    important_words = [w for w in words if w not in stop_words]
    
    # Get unique words and limit
    return list(set(important_words))[:25]


def extract_keywords(text):
    """Legacy function - kept for compatibility"""
    return extract_important_words(text)

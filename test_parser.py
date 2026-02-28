from utils.parser import extract_text
from utils.cleaner import clean_text
from utils.skill_extractor import extract_skills
from utils.matcher import calculate_similarity, skill_gap_analysis

file_path = "sample_resume.pdf"

# Job Description
job_description = """
Looking for a Python developer with experience in Flask, SQL, AWS, and Docker.
Should have knowledge of Machine Learning and backend API development.
"""

# Extract and clean resume
raw_text = extract_text(file_path)
cleaned_resume = clean_text(raw_text)

# Clean job description
cleaned_jd = clean_text(job_description)

# Extract skills
resume_skills = extract_skills(cleaned_resume)
jd_skills = extract_skills(cleaned_jd)

# Calculate similarity score
score = calculate_similarity(cleaned_resume, cleaned_jd)

# Skill gap analysis
matched, missing = skill_gap_analysis(resume_skills, jd_skills)

print("===== EXTRACTED RESUME SKILLS =====")
print(resume_skills)

print("\n===== JD SKILLS =====")
print(jd_skills)

print("\n===== MATCH SCORE =====")
print(f"{score}%")

print("\n===== MATCHED SKILLS =====")
print(matched)

print("\n===== MISSING SKILLS =====")
print(missing)

from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

def match_skills(resume_skills):
    """
    Match skills to create skill profile
    Returns formatted matched skills
    """
    if not isinstance(resume_skills, list):
        resume_skills = []
    return resume_skills

def skill_gap_analysis(resume_skills, jd_skills):
    matched = list(set(resume_skills) & set(jd_skills))
    missing = list(set(jd_skills) - set(resume_skills))
    return matched, missing

def calculate_similarity(resume_text, jd_text):
    """
    Calculate cosine similarity between resume and job description
    """
    try:
        vectorizer = TfidfVectorizer()
        vectors = vectorizer.fit_transform([resume_text, jd_text])
        similarity = cosine_similarity(vectors[0:1], vectors[1:2])
        score = similarity[0][0] * 100
        return round(score, 2)
    except:
        return 0

import json
import os


def load_skills():
    skills_path = os.path.join("data", "skills_list.json")
    
    with open(skills_path, "r") as file:
        skills = json.load(file)
    
    return skills


def extract_skills(text):
    skills_list = load_skills()
    found_skills = []

    for skill in skills_list:
        if skill in text:
            found_skills.append(skill)

    return list(set(found_skills))

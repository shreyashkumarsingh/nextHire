#!/usr/bin/env python
from utils.parser import parse_resume, extract_education
from werkzeug.datastructures import FileStorage
import io

# Read the sample resume
with open('sample_resume.pdf', 'rb') as f:
    content = f.read()

# Create a FileStorage object
file = FileStorage(
    stream=io.BytesIO(content),
    filename='sample_resume.pdf',
    content_type='application/pdf'
)

# Extract and print
text = parse_resume(file)
print('=== EXTRACTED TEXT (first 2000 chars) ===')
print(text[:2000])
print('\n=== CHECKING FOR EDUCATION KEYWORDS ===')
text_lower = text.lower()
if 'education' in text_lower:
    print("Found 'education' keyword")
    idx = text_lower.index('education')
    print(f"Context around education: {text[max(0, idx-100):idx+300]}")
else:
    print("'education' keyword NOT found")

if 'degree' in text_lower:
    print("Found 'degree' keyword")
    
if 'bachelor' in text_lower:
    print("Found 'bachelor' keyword")

print('\n=== EDUCATION EXTRACTION ===')
education = extract_education(text)
for edu in education:
    print(edu)

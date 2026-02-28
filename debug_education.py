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

# Extract text
text = parse_resume(file)

print('=== RAW EXTRACTED TEXT ===')
print(text)
print('\n=== LOOKING FOR EDUCATION SECTION ===')

lines = text.split('\n')
for i, line in enumerate(lines):
    if 'education' in line.lower() or 'bachelor' in line.lower() or 'master' in line.lower() or 'degree' in line.lower():
        # Print context (3 lines before and after)
        start = max(0, i - 2)
        end = min(len(lines), i + 3)
        print(f"\n--- Context around line {i} ---")
        for j in range(start, end):
            marker = ">>> " if j == i else "    "
            print(f"{marker}{j}: {lines[j]}")

print('\n=== EXTRACTED EDUCATION ===')
education = extract_education(text)
for edu in education:
    print(edu)

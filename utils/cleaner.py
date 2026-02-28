import re
import nltk
from nltk.corpus import stopwords

# Download stopwords once (first run only)
nltk.download('stopwords')

stop_words = set(stopwords.words('english'))


def clean_text(text):
    """
    Clean and preprocess text
    """

    # Lowercase
    text = text.lower()

    # Remove special characters
    text = re.sub(r'[^a-zA-Z0-9\s]', ' ', text)

    # Remove extra spaces
    text = re.sub(r'\s+', ' ', text).strip()

    # Remove stopwords
    words = text.split()
    words = [word for word in words if word not in stop_words]

    cleaned_text = " ".join(words)

    return cleaned_text

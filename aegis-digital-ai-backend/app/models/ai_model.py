import hashlib
import io
from PIL import Image

def get_image_hash(image_bytes: bytes) -> str:
    return hashlib.sha256(image_bytes).hexdigest()

def analyze_image_content(image_bytes: bytes) -> list:
    try:
        img = Image.open(io.BytesIO(image_bytes))
        width, height = img.size
        tags = []

        if width > 1000 and height > 1000:
            tags.append("high_resolution")
        if img.mode == 'RGB':
            tags.append("color_image")
        else:
            tags.append("grayscale_image")
        
        if width < 100 or height < 100:
            tags.append("thumbnail_size")

        return tags
    except Exception:
        return ["analysis_failed"]

def analyze_text_content(text_content: str) -> str:
    if not text_content:
        return "No content to summarize."
    
    sentences = text_content.split('.')
    sentences = [s.strip() for s in sentences if s.strip()]

    if len(sentences) > 2:
        return sentences[0] + ". " + sentences[1] + "..."
    
    return text_content

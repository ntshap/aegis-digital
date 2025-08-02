# AI Backend Documentation

## Overview
FastAPI-based backend yang menyediakan layanan analisis file menggunakan AI untuk platform Aegis Digital.

## Architecture

### Tech Stack
- **Framework**: FastAPI 0.104+
- **Image Processing**: Pillow (PIL) 10.0+
- **Hash Generation**: hashlib (built-in)
- **CORS**: FastAPI CORS middleware
- **Async**: Native Python asyncio

### Project Structure
```
app/
├── main.py              # FastAPI application
├── models/
│   └── ai_model.py      # AI processing functions
└── __init__.py
```

## API Endpoints

### Health Check
```http
GET /
```

**Response:**
```json
{
  "message": "Aegis Digital AI Backend is running!",
  "version": "1.0.0"
}
```

### File Analysis
```http
POST /analyze-file
Content-Type: multipart/form-data
```

**Request Body:**
- `file`: File binary (any format)

**Response:**
```json
{
  "filename": "example.jpg",
  "file_type": "image/jpeg",
  "ai_analysis": {
    "image_hash": "a1b2c3d4e5f6...",
    "is_duplicate": false,
    "tags": ["high_resolution", "color_image"]
  }
}
```

## AI Processing Modules

### Image Analysis (`analyze_image_content`)

#### Features
1. **Resolution Detection**
   - High resolution (>1000x1000): `high_resolution`
   - Thumbnail size (<100x100): `thumbnail_size`

2. **Color Mode Detection**
   - RGB images: `color_image`
   - Non-RGB: `grayscale_image`

3. **Format Support**
   - JPEG, PNG, GIF, BMP, TIFF
   - WebP, ICO support

#### Implementation
```python
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
```

### Text Analysis (`analyze_text_content`)

#### Features
1. **Text Summarization**
   - Extracts first 2 sentences
   - Handles edge cases (short text, no sentences)

2. **Keyword Extraction**
   - Simple word splitting approach
   - Returns first 5 words as keywords

#### Implementation
```python
def analyze_text_content(text_content: str) -> str:
    if not text_content:
        return "No content to summarize."
    
    sentences = text_content.split('.')
    sentences = [s.strip() for s in sentences if s.strip()]

    if len(sentences) > 2:
        return sentences[0] + ". " + sentences[1] + "..."
    
    return text_content
```

### Hash Generation (`get_image_hash`)

#### Purpose
- Generate SHA256 hash untuk duplicate detection
- Binary-level file comparison
- Fast duplicate checking

#### Implementation
```python
def get_image_hash(image_bytes: bytes) -> str:
    return hashlib.sha256(image_bytes).hexdigest()
```

## Error Handling

### Exception Types
1. **File Processing Errors**
   - Invalid file format
   - Corrupted file data
   - Unsupported file type

2. **Analysis Failures**
   - Image processing errors
   - Text encoding issues
   - Memory limitations

### Error Response Format
```json
{
  "detail": "AI analysis failed: specific error message"
}
```

## Performance Considerations

### Memory Management
- Files processed in memory streams
- No temporary file storage
- Automatic garbage collection

### Processing Limits
- Max file size: 50MB (configurable)
- Timeout: 30 seconds per request
- Concurrent requests: 100 (FastAPI default)

### Optimization Strategies
1. **Lazy Loading**: Only load required modules
2. **Caching**: Hash-based duplicate detection
3. **Async Processing**: Non-blocking I/O operations

## Security Features

### CORS Configuration
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### Input Validation
- File type verification
- Size limit enforcement
- Content sanitization

### Privacy Protection
- No file storage on server
- Hash-only duplicate tracking
- No persistent user data

## Deployment

### Local Development
```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### Production
```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 4
```

### Docker Deployment
```dockerfile
FROM python:3.11-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt

COPY app/ ./app/
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### Environment Variables
```env
# Production settings
CORS_ORIGINS=["https://yourdomain.com"]
MAX_FILE_SIZE=52428800  # 50MB
LOG_LEVEL=info
```

## Monitoring and Logging

### Health Checks
- `/` endpoint untuk service monitoring
- Response time tracking
- Error rate monitoring

### Logging Strategy
```python
import logging

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
```

### Metrics Collection
- Request count per endpoint
- Average processing time
- Error rates by file type

## Future Enhancements

### Advanced AI Features
1. **Computer Vision**
   - Object detection
   - Face recognition
   - Scene classification

2. **Natural Language Processing**
   - Sentiment analysis
   - Entity extraction
   - Document classification

3. **Machine Learning Models**
   - Custom trained models
   - GPU acceleration
   - Model versioning

### Integration Improvements
1. **Batch Processing**: Multiple file analysis
2. **Webhook Support**: Real-time notifications
3. **API Versioning**: Backward compatibility
4. **Rate Limiting**: Request throttling

## Testing

### Unit Tests
```python
import pytest
from app.models.ai_model import analyze_image_content

def test_image_analysis():
    # Test image analysis with sample data
    pass

def test_text_analysis():
    # Test text summarization
    pass
```

### Integration Tests
```python
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_analyze_file_endpoint():
    with open("test_image.jpg", "rb") as f:
        response = client.post("/analyze-file", files={"file": f})
    assert response.status_code == 200
```

### Performance Tests
- Load testing dengan multiple concurrent requests
- Memory usage monitoring
- Response time benchmarks

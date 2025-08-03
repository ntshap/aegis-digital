# Import library yang diperlukan
from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
import requests
from dotenv import load_dotenv # Import pustaka dotenv
from pathlib import Path # Import Path untuk memanipulasi path file

# PENTING: Memuat variabel lingkungan dari file .env dari direktori induk
dotenv_path = Path('..') / '.env'
load_dotenv(dotenv_path=dotenv_path)

# Mengambil API Key dari variabel lingkungan.
HUGGINGFACE_API_KEY = os.getenv("HUGGINGFACE_API_KEY")

# Pastikan API Key ada (optional for testing)
if not HUGGINGFACE_API_KEY or HUGGINGFACE_API_KEY == "your_huggingface_api_key_here":
    print("Warning: HUGGINGFACE_API_KEY is not set properly. Using mock responses for testing.")
    HUGGINGFACE_API_KEY = None

# Buat instance FastAPI
app = FastAPI(
    title="Aegis Digital AI Backend API",
    description="API untuk menganalisis konten file secara cerdas.",
    version="1.0.0",
)

# Konfigurasi CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Model data untuk request API
class FileAnalysisRequest(BaseModel):
    content: str
    
class AnalysisResponse(BaseModel):
    status: str
    message: str
    analysis: dict

# Ganti URL ini dengan URL Inference API model yang Anda pilih di Hugging Face
HUGGINGFACE_API_URL = "https://api-inference.huggingface.co/models/tabularisai/multilingual-sentiment-analysis"

# Fungsi untuk mengubah hasil sentiment analysis menjadi teks yang mudah dipahami
def format_sentiment_analysis(result: dict) -> str:
    if "error" in result:
        return f"❌ Terjadi kesalahan: {result['error']}"
    
    if "note" in result:
        # Mock response case
        prediction = result.get("model_prediction", {})
        label = prediction.get("label", "Unknown")
        score = prediction.get("score", 0)
        
        if label == "POSITIVE":
            sentiment_text = "😊 POSITIF"
            description = "Konten ini memiliki sentimen yang positif dan baik."
        elif label == "NEGATIVE":
            sentiment_text = "😞 NEGATIF"
            description = "Konten ini memiliki sentimen yang negatif."
        else:
            sentiment_text = "😐 NETRAL"
            description = "Konten ini memiliki sentimen yang netral."
        
        confidence = f"{score * 100:.1f}%"
        
        return f"""📊 HASIL ANALISIS SENTIMENT AI

🎯 Sentiment: {sentiment_text}
📈 Tingkat Keyakinan: {confidence}
📝 Penjelasan: {description}

⚠️ Catatan: Ini adalah hasil uji coba. Silakan atur HUGGINGFACE_API_KEY untuk analisis yang sesungguhnya."""
    
    # Real API response case
    if "model_prediction" in result:
        prediction = result["model_prediction"]
        if isinstance(prediction, list) and len(prediction) > 0:
            # Handle array response
            top_prediction = prediction[0]
        else:
            # Handle single object response
            top_prediction = prediction
        
        label = top_prediction.get("label", "Unknown")
        score = top_prediction.get("score", 0)
        
        # Map different label formats
        if label.upper() in ["POSITIVE", "POS"]:
            sentiment_text = "😊 POSITIF"
            description = "Konten ini memiliki sentimen yang positif dan baik."
        elif label.upper() in ["NEGATIVE", "NEG"]:
            sentiment_text = "😞 NEGATIF"
            description = "Konten ini memiliki sentimen yang negatif."
        elif label.upper() in ["NEUTRAL", "NEU"]:
            sentiment_text = "😐 NETRAL"
            description = "Konten ini memiliki sentimen yang netral."
        elif label == "Very Negative":
            sentiment_text = "😡 SANGAT NEGATIF"
            description = "Konten ini memiliki sentimen yang sangat negatif."
        elif label == "Very Positive":
            sentiment_text = "🤩 SANGAT POSITIF"
            description = "Konten ini memiliki sentimen yang sangat positif."
        else:
            sentiment_text = f"📊 {label.upper()}"
            description = f"Konten ini diklasifikasikan sebagai {label}."
        
        confidence = f"{score * 100:.1f}%"
        
        return f"""📊 HASIL ANALISIS SENTIMENT AI

🎯 Sentiment: {sentiment_text}
📈 Tingkat Keyakinan: {confidence}
📝 Penjelasan: {description}

💡 Tingkat keyakinan menunjukkan seberapa yakin AI dengan hasil analisisnya. Semakin tinggi persentasenya, semakin yakin AI dengan hasilnya."""
    
    return "❓ Format hasil analisis tidak dikenali."

# Fungsi untuk memanggil Hugging Face Inference API
def get_huggingface_analysis(content: str) -> dict:
    if not HUGGINGFACE_API_KEY:
        # Return mock response for testing
        mock_result = {
            "model_prediction": {
                "label": "POSITIVE",
                "score": 0.9998
            },
            "note": "Mock response - Please set HUGGINGFACE_API_KEY for real AI analysis"
        }
        
        # Format ke teks yang mudah dipahami
        formatted_text = format_sentiment_analysis(mock_result)
        return {
            "user_friendly_text": formatted_text,
            "raw_data": mock_result
        }
    
    headers = {"Authorization": f"Bearer {HUGGINGFACE_API_KEY}"}
    payload = {"inputs": content}
    try:
        response = requests.post(HUGGINGFACE_API_URL, headers=headers, json=payload)
        response.raise_for_status() # Raise an exception for bad status codes
        result = response.json()
        
        analysis_result = {}
        if isinstance(result, list) and len(result) > 0:
            analysis_result["model_prediction"] = result[0]
        else:
            analysis_result["error"] = "Format respons dari API tidak sesuai."
        
        # Format ke teks yang mudah dipahami
        formatted_text = format_sentiment_analysis(analysis_result)
        return {
            "user_friendly_text": formatted_text,
            "raw_data": analysis_result
        }
            
    except requests.exceptions.RequestException as e:
        print(f"Error calling Hugging Face API: {e}")
        error_result = {"error": "Gagal terhubung ke API Hugging Face."}
        formatted_text = format_sentiment_analysis(error_result)
        return {
            "user_friendly_text": formatted_text,
            "raw_data": error_result
        }

@app.get("/")
def read_root():
    return {"message": "Aegis Digital AI Backend berjalan!"}

@app.post("/analyze-file")
async def analyze_file_upload(file: UploadFile = File(...)):
    try:
        # Read file content
        content = await file.read()
        
        # Try to decode as text (works for text files, code files, etc.)
        try:
            text_content = content.decode('utf-8')
        except UnicodeDecodeError:
            # For binary files, use filename and size as content
            text_content = f"Binary file: {file.filename}, Size: {len(content)} bytes, Type: {file.content_type}"
        
        # Limit content length for API
        if len(text_content) > 1000:
            text_content = text_content[:1000] + "... (truncated)"
        
        analysis_result = get_huggingface_analysis(text_content)
        
        if "error" in analysis_result.get("raw_data", {}):
            raise HTTPException(status_code=500, detail=analysis_result["raw_data"]["error"])

        return {
            "filename": file.filename,
            "file_type": file.content_type,
            "ai_analysis": analysis_result["user_friendly_text"],
            "ai_analysis_raw": analysis_result["raw_data"]  # Keep raw data for debugging
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Terjadi kesalahan pada server: {str(e)}")

@app.post("/api/analyze-file", response_model=AnalysisResponse)
async def analyze_file(request: FileAnalysisRequest):
    try:
        analysis_result = get_huggingface_analysis(request.content)
        
        if "error" in analysis_result.get("raw_data", {}):
            raise HTTPException(status_code=500, detail=analysis_result["raw_data"]["error"])

        return AnalysisResponse(
            status="success",
            message="File berhasil dianalisis dengan Hugging Face.",
            analysis={
                "user_friendly_text": analysis_result["user_friendly_text"],
                "raw_data": analysis_result["raw_data"]
            }
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Terjadi kesalahan pada server: {str(e)}")

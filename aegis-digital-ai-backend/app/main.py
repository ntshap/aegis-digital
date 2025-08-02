# Import library yang diperlukan
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
from typing import List, Optional

# Ini adalah dummy import untuk model AI yang akan Anda kembangkan
# Pastikan Anda menginstal semua dependensi yang diperlukan.
# Contoh: from .models.ai_model import analyze_content
# Untuk hackathon, kita bisa menggunakan model AI yang sangat sederhana
# atau memanggil API dari layanan AI gratis jika ada.

# Buat instance FastAPI
app = FastAPI(
    title="Aegis Digital AI Backend API",
    description="API untuk menganalisis konten file secara cerdas.",
    version="1.0.0",
)

# -----------------------------------------------------------------------------
# PENTING: Konfigurasi CORS (Cross-Origin Resource Sharing)
# Ini memungkinkan frontend (misalnya, Next.js yang berjalan di port 3000)
# untuk berkomunikasi dengan backend ini (misalnya, yang berjalan di port 8000).
# Pastikan Anda hanya mengizinkan origin yang Anda percayai.
# Untuk hackathon, kita bisa mengizinkan semua, tapi untuk produksi HARUS spesifik.
# -----------------------------------------------------------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Mengizinkan semua origin untuk demo hackathon
    allow_credentials=True,
    allow_methods=["*"],  # Mengizinkan semua metode (POST, GET, dll.)
    allow_headers=["*"],  # Mengizinkan semua header
)

# Model data untuk request API
class FileAnalysisRequest(BaseModel):
    # Konten file sebagai string untuk dianalisis
    content: str
    
class AnalysisResponse(BaseModel):
    # Hasil analisis, bisa berupa label atau insight lain
    status: str
    message: str
    analysis: dict

# Dummy fungsi AI untuk hackathon
def simple_ai_analysis(content: str) -> dict:
    """
    Simulasi fungsi AI sederhana untuk menganalisis konten.
    Untuk MVP, ini bisa berupa logika sederhana seperti deteksi kata kunci.
    """
    insights = {}
    content_lower = content.lower()
    
    # Contoh deteksi kata kunci
    if "private key" in content_lower or "password" in content_lower:
        insights["security_alert"] = "Potensi data sensitif terdeteksi."
    
    if "invoice" in content_lower or "pembayaran" in content_lower:
        insights["category"] = "Dokumen Keuangan"
    
    if len(content) > 500:
        insights["length"] = "Konten panjang, perlu diarsipkan."
        
    return insights

@app.get("/")
def read_root():
    """
    Endpoint root untuk memeriksa apakah API berjalan.
    """
    return {"message": "Aegis Digital AI Backend berjalan!"}

@app.post("/api/analyze-file", response_model=AnalysisResponse)
async def analyze_file(request: FileAnalysisRequest):
    """
    Endpoint untuk menerima konten file dan menganalisisnya dengan AI.
    """
    try:
        # Panggil fungsi AI
        analysis_result = simple_ai_analysis(request.content)

        # Kembalikan hasil analisis
        return AnalysisResponse(
            status="success",
            message="File berhasil dianalisis.",
            analysis=analysis_result
        )

    except Exception as e:
        # Penanganan error yang baik
        raise HTTPException(status_code=500, detail=f"Terjadi kesalahan pada server: {str(e)}")

# PENTING: Jangan hardcode API key di sini. Gunakan file .env!
# os.getenv("HUGGINGFACE_API_KEY") atau sejenisnya

from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import Optional
import io
import os
import base64 # Untuk menangani base64 jika diperlukan, meskipun kita akan pakai UploadFile langsung

# Import logika AI dari modul ai_model
from .models.ai_model import get_image_hash, analyze_image_content, analyze_text_content

app = FastAPI()

uploaded_file_hashes = set()

@app.get("/")
async def read_root():
    """Endpoint dasar untuk memeriksa apakah backend AI berjalan."""
    return {"message": "Aegis Digital AI Backend is running!"}

@app.post("/analyze-file")
async def analyze_file(file: UploadFile = File(...)):
    """
    Endpoint untuk menerima file, mengunggahnya ke IPFS (secara konseptual),
    dan menganalisisnya dengan AI.
    """
    try:
        file_bytes = await file.read()
        file_type_main = file.content_type.split('/')[0] # "image", "text", dll.
        analysis_results = {}

        if file_type_main == "image":
            image_hash = get_image_hash(file_bytes)
            analysis_results["image_hash"] = image_hash
            
            # Periksa duplikat
            is_duplicate = image_hash in uploaded_file_hashes
            analysis_results["is_duplicate"] = is_duplicate
            if not is_duplicate:
                uploaded_file_hashes.add(image_hash) # Tambahkan ke set jika bukan duplikat

            image_tags = analyze_image_content(file_bytes)
            analysis_results["tags"] = image_tags

        elif file_type_main == "text":
            text_content = file_bytes.decode('utf-8')
            summary = analyze_text_content(text_content)
            analysis_results["summary"] = summary
            # Contoh keyword sederhana: 5 kata pertama
            analysis_results["keywords"] = text_content.split()[:5] 

        else:
            analysis_results["message"] = "Unsupported file type for detailed AI analysis."
            analysis_results["file_type"] = file.content_type

        return JSONResponse(content={
            "filename": file.filename,
            "file_type": file.content_type,
            "ai_analysis": analysis_results
        })

    except Exception as e:
        # Tangani kesalahan umum dan berikan pesan yang jelas
        raise HTTPException(status_code=500, detail=f"AI analysis failed: {e}")



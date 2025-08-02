from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from .models.ai_model import get_image_hash, analyze_image_content, analyze_text_content

app = FastAPI(title="Aegis Digital AI Backend", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

uploaded_file_hashes = set()

@app.get("/")
async def read_root():
    return {"message": "Aegis Digital AI Backend is running!", "version": "1.0.0"}

@app.post("/analyze-file")
async def analyze_file(file: UploadFile = File(...)):
    try:
        file_bytes = await file.read()
        file_type_main = file.content_type.split('/')[0]
        analysis_results = {}

        if file_type_main == "image":
            image_hash = get_image_hash(file_bytes)
            analysis_results["image_hash"] = image_hash
            
            is_duplicate = image_hash in uploaded_file_hashes
            analysis_results["is_duplicate"] = is_duplicate
            if not is_duplicate:
                uploaded_file_hashes.add(image_hash)

            image_tags = analyze_image_content(file_bytes)
            analysis_results["tags"] = image_tags

        elif file_type_main == "text":
            text_content = file_bytes.decode('utf-8')
            summary = analyze_text_content(text_content)
            analysis_results["summary"] = summary
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
        raise HTTPException(status_code=500, detail=f"AI analysis failed: {e}")



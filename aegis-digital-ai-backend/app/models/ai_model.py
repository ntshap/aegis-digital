import hashlib
import io
from PIL import Image

def get_image_hash(image_bytes: bytes) -> str:
    """
    Menghitung SHA256 hash dari gambar untuk deteksi duplikat.
    Ini adalah cara cepat untuk mengidentifikasi gambar yang identik secara biner.
    """
    return hashlib.sha256(image_bytes).hexdigest()

def analyze_image_content(image_bytes: bytes) -> list:
    """
    Contoh analisis gambar sederhana:
    Untuk hackathon, ini bisa sangat dasar. Di dunia nyata, ini akan menggunakan
    model Computer Vision (misalnya, TensorFlow, PyTorch) untuk deteksi objek,
    klasifikasi, atau penandaan yang lebih canggih.
    """
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
        
        # Contoh sederhana: deteksi jika gambar sangat kecil
        if width < 100 or height < 100:
            tags.append("thumbnail_size")

        return tags
    except Exception as e:
        print(f"Error analyzing image: {e}")
        return ["analysis_failed"]

def analyze_text_content(text_content: str) -> str:
    """
    Contoh ringkasan teks sederhana:
    Untuk hackathon, ini bisa sangat dasar. Di dunia nyata, ini akan menggunakan
    model NLP (misalnya, TextRank, BERT, atau model Transformer lainnya) untuk
    ringkasan yang lebih koheren dan ekstraksi kata kunci yang lebih baik.
    """
    if not text_content:
        return "No content to summarize."
    
    # Pisahkan teks menjadi kalimat
    sentences = text_content.split('.')
    sentences = [s.strip() for s in sentences if s.strip()] # Hapus spasi dan kalimat kosong

    # Ambil 2 kalimat pertama jika ada lebih dari 2 kalimat
    if len(sentences) > 2:
        return sentences[0] + ". " + sentences[1] + "..."
    
    # Jika hanya sedikit kalimat, kembalikan semua teks
    return text_content

# Anda bisa menambahkan fungsi AI lain di sini (misalnya, deteksi objek, klasifikasi dokumen)

const AI_BACKEND_URL = process.env.NEXT_PUBLIC_AI_BACKEND_URL || 'http://127.0.0.1:8000';

export interface AIAnalysisResult {
  filename: string;
  file_type: string;
  ai_analysis: unknown;
}

export class AIService {
  static async analyzeFile(file: File): Promise<AIAnalysisResult> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${AI_BACKEND_URL}/analyze-file`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`AI analysis failed: ${response.status} - ${errorText}`);
    }

    return response.json();
  }
}

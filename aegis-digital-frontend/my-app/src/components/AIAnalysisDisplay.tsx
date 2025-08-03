import React from 'react';
import { Zap, Eye, EyeOff } from 'lucide-react';

interface PredictionResult {
  label?: string;
  score?: number;
}

interface AnalysisResult {
  user_friendly_text?: string;
  model_prediction?: string | string[] | PredictionResult | PredictionResult[];
  raw_data?: object;
  // Added support for new AI backend format
  filename?: string;
  file_type?: string;
  ai_analysis?: any;
}

interface AIAnalysisDisplayProps {
  analysisResult: string | AnalysisResult | null;
}

const AIAnalysisDisplay: React.FC<AIAnalysisDisplayProps> = ({ analysisResult }) => {
  const [showRawData, setShowRawData] = React.useState(false);

  // Handle different response formats
  const getUserFriendlyText = () => {
    if (typeof analysisResult === 'string') {
      return analysisResult;
    }
    
    // New AI backend format
    if (analysisResult?.ai_analysis && analysisResult?.file_type) {
      return formatNewAIAnalysis(analysisResult);
    }
    
    if (analysisResult?.user_friendly_text) {
      return analysisResult.user_friendly_text;
    }
    
    // Fallback for old format
    if (analysisResult?.model_prediction) {
      const prediction = Array.isArray(analysisResult.model_prediction) 
        ? analysisResult.model_prediction[0] 
        : analysisResult.model_prediction;
      
      // Type guard to check if prediction is a PredictionResult object
      const label = (typeof prediction === 'object' && prediction && 'label' in prediction) 
        ? prediction.label || 'Unknown' 
        : 'Unknown';
      const score = (typeof prediction === 'object' && prediction && 'score' in prediction) 
        ? prediction.score || 0 
        : 0;
      
      let sentiment_text = '';
      let description = '';
      
      if (label.toUpperCase().includes('POSITIVE') || label === 'POS') {
        sentiment_text = '😊 POSITIF';
        description = 'Konten ini memiliki sentimen yang positif dan baik.';
      } else if (label.toUpperCase().includes('NEGATIVE') || label === 'NEG') {
        sentiment_text = '😞 NEGATIF';
        description = 'Konten ini memiliki sentimen yang negatif.';
      } else if (label.toUpperCase().includes('NEUTRAL') || label === 'NEU') {
        sentiment_text = '😐 NETRAL';
        description = 'Konten ini memiliki sentimen yang netral.';
      } else {
        sentiment_text = `📊 ${label.toUpperCase()}`;
        description = `Konten ini diklasifikasikan sebagai ${label}.`;
      }
      
      const confidence = `${(score * 100).toFixed(1)}%`;
      
      return `📊 HASIL ANALISIS SENTIMENT AI

🎯 Sentiment: ${sentiment_text}
📈 Tingkat Keyakinan: ${confidence}
📝 Penjelasan: ${description}

💡 Tingkat keyakinan menunjukkan seberapa yakin AI dengan hasil analisisnya. Semakin tinggi persentasenya, semakin yakin AI dengan hasilnya.`;
    }
    
    return JSON.stringify(analysisResult, null, 2);
  };

  // Format new AI analysis format
  const formatNewAIAnalysis = (result: AnalysisResult) => {
    const filename = result.filename || 'Unknown file';
    const fileType = result.file_type || 'Unknown type';
    const analysis = result.ai_analysis;

    let analysisText = `🤖 HASIL ANALISIS AI AEGIS DIGITAL

📄 File: ${filename}
📂 Tipe File: ${fileType}

🔍 ANALISIS KONTEN:
`;

    // Handle different analysis formats
    if (typeof analysis === 'object' && analysis) {
      if (analysis.model_prediction) {
        const prediction = Array.isArray(analysis.model_prediction) 
          ? analysis.model_prediction[0] 
          : analysis.model_prediction;
        
        if (typeof prediction === 'object' && prediction) {
          const label = prediction.label || 'Unknown';
          const score = prediction.score || 0;
          
          analysisText += `
🎯 Prediksi: ${label}
📈 Confidence Score: ${(score * 100).toFixed(1)}%
🔥 Status: ${score > 0.7 ? 'HIGH CONFIDENCE' : score > 0.4 ? 'MEDIUM CONFIDENCE' : 'LOW CONFIDENCE'}
`;
        }
      }
      
      if (analysis.user_friendly_text) {
        analysisText += `
📝 Detail Analisis:
${analysis.user_friendly_text}
`;
      }
    } else if (typeof analysis === 'string') {
      analysisText += `
📝 Hasil: ${analysis}
`;
    }

    analysisText += `
⚡ Powered by Aegis Digital AI
🔒 Hasil tersimpan aman di blockchain Lisk`;

    return analysisText;
  };

  const getRawData = () => {
    if (typeof analysisResult === 'object' && analysisResult && 'raw_data' in analysisResult) {
      return JSON.stringify(analysisResult.raw_data, null, 2);
    }
    return JSON.stringify(analysisResult, null, 2);
  };

  return (
    <div className="neubrutal-card p-4 lg:p-6">
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-bold text-base lg:text-lg text-black flex items-center">
          <Zap className="w-4 h-4 lg:w-5 lg:h-5 mr-2 text-black" />
          AI ANALYSIS RESULT
        </h4>
        
        <button
          onClick={() => setShowRawData(!showRawData)}
          className="flex items-center text-xs px-2 py-1 neubrutal-border neubrutal-bg-gray hover:neubrutal-bg-yellow transition-colors"
          title={showRawData ? "Tampilkan hasil mudah dibaca" : "Tampilkan data mentah"}
        >
          {showRawData ? <Eye className="w-3 h-3 mr-1" /> : <EyeOff className="w-3 h-3 mr-1" />}
          {showRawData ? "Simple" : "Raw"}
        </button>
      </div>
      
      <div className="neubrutal-bg-yellow p-3 lg:p-4 neubrutal-border">
        {showRawData ? (
          <pre className="text-xs lg:text-sm whitespace-pre-wrap text-black overflow-auto max-h-48 lg:max-h-64 font-mono">
            {getRawData()}
          </pre>
        ) : (
          <div className="text-xs lg:text-sm whitespace-pre-wrap text-black overflow-auto max-h-48 lg:max-h-64">
            {getUserFriendlyText()}
          </div>
        )}
      </div>
      
      {!showRawData && (
        <div className="mt-2 text-xs text-gray-600 flex items-center">
          <EyeOff className="w-3 h-3 mr-1" />
          Klik &quot;Raw&quot; untuk melihat data JSON lengkap
        </div>
      )}
    </div>
  );
};

export default AIAnalysisDisplay;

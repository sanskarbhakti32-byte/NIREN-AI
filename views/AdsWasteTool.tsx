
import React, { useState } from 'react';
import { gemini, Schemas } from '../services/geminiService';
import { Upload, AlertCircle, TrendingDown, Target, Loader2, CheckCircle2 } from 'lucide-react';

const AdsWasteTool: React.FC = () => {
  const [csvData, setCsvData] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleAnalyze = async () => {
    if (!csvData) return;
    setIsLoading(true);

    const prompt = `Analyze this Amazon Search Term Report data:
    ${csvData}
    
    Find:
    1. Zero-order keywords with > $5 spend.
    2. High spend, low CTR (< 0.2%) terms.
    3. Terms with high ACoS (> 100%).
    
    Output a structured list of Negative Keywords with reasons and confidence levels.`;

    try {
      const data = await gemini.generateStructuredContent(prompt, Schemas.ADS_WASTE);
      setResult(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
        <div className="mb-6 flex items-start gap-4 p-4 bg-red-50 rounded-2xl border border-red-100">
          <AlertCircle className="text-red-500 flex-shrink-0 mt-0.5" size={20} />
          <div>
            <h4 className="text-red-900 font-bold text-sm">Actionable Waste Detection</h4>
            <p className="text-red-700 text-xs mt-1">Paste your Amazon Search Term Report snippet (at least columns: Keyword, Spend, Sales, CTR) to find money-leaking terms.</p>
          </div>
        </div>
        
        <textarea 
          className="w-full h-80 p-4 bg-black border-2 border-slate-800 rounded-2xl focus:ring-2 focus:ring-red-500 outline-none font-mono text-sm resize-none mb-6 text-white placeholder-slate-600"
          placeholder="Keyword, Spend, Orders, CTR, CPC..."
          value={csvData}
          onChange={(e) => setCsvData(e.target.value)}
        />

        <button 
          onClick={handleAnalyze}
          disabled={isLoading || !csvData}
          className="w-full py-4 bg-red-600 text-white font-bold rounded-2xl hover:bg-red-700 disabled:opacity-50 transition-all flex items-center justify-center gap-2 shadow-lg shadow-red-100"
        >
          {isLoading ? <Loader2 className="animate-spin" /> : <>Detect Ad Waste <TrendingDown size={18} /></>}
        </button>
      </div>

      <div className="space-y-4">
        {result ? (
          <>
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-slate-800 flex items-center gap-2">
                  <Target size={20} className="text-red-500" /> Negative Keyword List
                </h3>
                <span className="px-3 py-1 bg-red-50 text-red-600 rounded-full text-xs font-bold uppercase tracking-wider">
                  {result.negatives.length} Found
                </span>
              </div>

              <div className="space-y-3 max-h-[600px] overflow-y-auto custom-scrollbar pr-2">
                {result.negatives.map((item: any, i: number) => (
                  <div key={i} className="p-4 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-white hover:border-red-200 transition-all">
                    <div className="flex justify-between items-start mb-2">
                      <p className="font-bold text-slate-800">{item.keyword}</p>
                      <div className="flex items-center gap-1 text-amber-600 text-xs font-bold">
                        <CheckCircle2 size={12} /> {Math.round(item.confidence * 100)}% Conf
                      </div>
                    </div>
                    <p className="text-sm text-slate-500 leading-relaxed">{item.reason}</p>
                  </div>
                ))}
              </div>
            </div>
            
            <button className="w-full py-3 border-2 border-slate-200 text-slate-600 font-bold rounded-2xl hover:bg-slate-50 transition-all">
              Download as Negative CSV
            </button>
          </>
        ) : (
          <div className="h-full min-h-[400px] bg-slate-100/50 border-2 border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center text-slate-400 text-center px-12">
            <Upload size={48} className="mb-4 text-slate-200" />
            <p>Detection results will appear here after analysis.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdsWasteTool;

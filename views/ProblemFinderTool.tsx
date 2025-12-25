
import React, { useState } from 'react';
import { gemini } from '../services/geminiService';
import { Loader2, Search, CheckCircle, AlertTriangle, ArrowRight } from 'lucide-react';

const ProblemFinderTool: React.FC = () => {
  const [data, setData] = useState({ clicks: '', conversions: '', ctr: '', listingText: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleAnalyze = async () => {
    setIsLoading(true);
    const prompt = `Analyze this Amazon listing performance:
    Stats: ${data.clicks} Clicks, ${data.conversions} Sales, ${data.ctr}% CTR
    Listing: ${data.listingText}
    
    Diagnose:
    1. If High Clicks + Low Conversion -> Identify content/pricing/review issues.
    2. If Low CTR -> Identify image/title issues.
    3. Provide EXACT fixes and a rewritten high-converting Title and Bullets.
    
    Respond in Markdown format with clear headings.`;

    try {
      const stream = await gemini.streamText(prompt, "You are an Amazon Growth Strategist specializing in Conversion Rate Optimization.");
      let fullText = '';
      for await (const chunk of stream) {
        fullText += chunk.text;
        setResult(fullText);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      <div className="lg:col-span-5 space-y-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase">Clicks</label>
              <input 
                className="w-full p-3 bg-black border-2 border-slate-800 rounded-xl text-white placeholder-slate-600"
                placeholder="1000"
                value={data.clicks}
                onChange={(e) => setData({...data, clicks: e.target.value})}
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase">Sales</label>
              <input 
                className="w-full p-3 bg-black border-2 border-slate-800 rounded-xl text-white placeholder-slate-600"
                placeholder="20"
                value={data.conversions}
                onChange={(e) => setData({...data, conversions: e.target.value})}
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase">CTR %</label>
              <input 
                className="w-full p-3 bg-black border-2 border-slate-800 rounded-xl text-white placeholder-slate-600"
                placeholder="0.3"
                value={data.ctr}
                onChange={(e) => setData({...data, ctr: e.target.value})}
              />
            </div>
          </div>
          
          <div>
            <label className="text-xs font-bold text-slate-400 uppercase">Current Listing Text</label>
            <textarea 
              className="w-full h-64 p-4 bg-black border-2 border-slate-800 rounded-2xl resize-none mt-1 text-white placeholder-slate-600"
              placeholder="Paste your current title and bullet points here..."
              value={data.listingText}
              onChange={(e) => setData({...data, listingText: e.target.value})}
            />
          </div>

          <button 
            onClick={handleAnalyze}
            disabled={isLoading || !data.listingText}
            className="w-full py-4 bg-orange-500 text-white font-bold rounded-2xl hover:bg-orange-600 transition-all flex items-center justify-center gap-2"
          >
            {isLoading ? <Loader2 className="animate-spin" /> : <>Audit Listing <ArrowRight size={18} /></>}
          </button>
        </div>
      </div>

      <div className="lg:col-span-7 bg-slate-50 rounded-3xl p-8 border border-slate-200 overflow-y-auto custom-scrollbar max-h-[800px]">
        {result ? (
          <div className="prose prose-slate prose-headings:text-orange-900 prose-headings:font-bold prose-strong:text-orange-600">
            <div dangerouslySetInnerHTML={{ __html: result.replace(/\n/g, '<br/>') }} className="text-slate-700 leading-relaxed" />
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-slate-400 text-center py-20">
             <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-6">
               <Search size={32} className="text-orange-200" />
             </div>
             <h3 className="text-xl font-bold text-slate-600 mb-2">Diagnostic Report</h3>
             <p className="max-w-xs">Fill in your metrics to see a detailed audit of why your product isn't converting as expected.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProblemFinderTool;

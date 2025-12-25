
import React, { useState } from 'react';
import { gemini, Schemas } from '../services/geminiService';
import { MessageSquare, Loader2, ThumbsUp, ThumbsDown, Lightbulb, Ruler } from 'lucide-react';

const ReviewAnalyzerTool: React.FC = () => {
  const [reviews, setReviews] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleAnalyze = async () => {
    if (!reviews) return;
    setIsLoading(true);

    const prompt = `Analyze these customer reviews for an e-commerce product:
    Reviews: ${reviews}
    
    Extract:
    1. Common complaints.
    2. Sizing issues.
    3. Fabric/Material feedback.
    4. What customers LOVE.
    5. New ad angles based on real feedback.
    6. Product improvement ideas.`;

    try {
      const data = await gemini.generateStructuredContent(prompt, Schemas.REVIEW_INSIGHTS);
      setResult(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      <div className="lg:col-span-5 flex flex-col gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col flex-1">
          <label className="text-sm font-bold text-slate-700 mb-2 uppercase tracking-widest">Paste Customer Reviews</label>
          <textarea 
            className="flex-1 min-h-[400px] p-4 bg-black border-2 border-slate-800 rounded-2xl focus:ring-2 focus:ring-purple-500 outline-none resize-none mb-6 text-sm text-white placeholder-slate-600"
            placeholder="Paste 10-50 reviews from Amazon/Flipkart here..."
            value={reviews}
            onChange={(e) => setReviews(e.target.value)}
          />
          <button 
            onClick={handleAnalyze}
            disabled={isLoading || !reviews}
            className="w-full py-4 bg-purple-600 text-white font-bold rounded-2xl hover:bg-purple-700 transition-all flex items-center justify-center gap-2"
          >
            {isLoading ? <Loader2 className="animate-spin" /> : <>Extract Insights <MessageSquare size={18} /></>}
          </button>
        </div>
      </div>

      <div className="lg:col-span-7 space-y-6">
        {result ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in duration-700">
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
              <h3 className="font-bold text-green-600 flex items-center gap-2 mb-4">
                <ThumbsUp size={18} /> What they LOVE
              </h3>
              <ul className="space-y-2">
                {result.pros.map((p: string, i: number) => (
                  <li key={i} className="text-sm text-slate-600 flex gap-2">
                    <span className="text-green-500">•</span> {p}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
              <h3 className="font-bold text-red-600 flex items-center gap-2 mb-4">
                <ThumbsDown size={18} /> Common Complaints
              </h3>
              <ul className="space-y-2">
                {result.cons.map((c: string, i: number) => (
                  <li key={i} className="text-sm text-slate-600 flex gap-2">
                    <span className="text-red-500">•</span> {c}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
              <h3 className="font-bold text-blue-600 flex items-center gap-2 mb-4">
                <Ruler size={18} /> Size & Fit Insights
              </h3>
              <ul className="space-y-2">
                {result.sizeIssues.map((s: string, i: number) => (
                  <li key={i} className="text-sm text-slate-600 flex gap-2">
                    <span className="text-blue-500">•</span> {s}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-purple-900 p-6 rounded-3xl shadow-xl">
              <h3 className="font-bold text-purple-200 flex items-center gap-2 mb-4">
                <Lightbulb size={18} /> New Ad Angles
              </h3>
              <ul className="space-y-2">
                {result.newAdAngles.map((a: string, i: number) => (
                  <li key={i} className="text-sm text-purple-100 flex gap-2 italic">
                    "{a}"
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ) : (
          <div className="h-full min-h-[500px] bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center text-slate-400 p-12 text-center">
             <div className="p-4 bg-white rounded-full mb-4">
               <MessageSquare size={32} className="text-slate-200" />
             </div>
             <p className="max-w-xs">Mining reviews manually takes hours. Paste them here to see exactly what to fix and what to brag about in your ads.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewAnalyzerTool;

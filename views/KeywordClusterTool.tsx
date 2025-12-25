
import React, { useState } from 'react';
import { gemini, Schemas } from '../services/geminiService';
import { Search, Loader2, Target, Filter, Layers } from 'lucide-react';

const KeywordClusterTool: React.FC = () => {
  const [keywords, setKeywords] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleCluster = async () => {
    if (!keywords) return;
    setIsLoading(true);

    const prompt = `Cluster these e-commerce keywords by customer intent:
    Keywords: ${keywords}
    
    Intents to use: Buying (Transactional), Browsing (Informational), Waste (Irrelevant).
    For each cluster, suggest an Amazon campaign strategy (Exact/Phrase/Broad).`;

    try {
      const data = await gemini.generateStructuredContent(prompt, Schemas.KEYWORD_CLUSTERS);
      setResult(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const placeholderText = "kids tshirts\ncotton frocks for girls\nparty wear dress for kids\n...";

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col h-full">
        <label className="text-sm font-bold text-slate-700 mb-2 uppercase tracking-widest">Input Keywords (One per line)</label>
        <textarea 
          className="flex-1 min-h-[400px] p-4 bg-black border-2 border-slate-800 rounded-2xl focus:ring-2 focus:ring-green-500 outline-none resize-none mb-6 text-sm text-white placeholder-slate-600"
          placeholder={placeholderText}
          value={keywords}
          onChange={(e) => setKeywords(e.target.value)}
        />
        <button 
          onClick={handleCluster}
          disabled={isLoading || !keywords}
          className="w-full py-4 bg-green-600 text-white font-bold rounded-2xl hover:bg-green-700 transition-all flex items-center justify-center gap-2"
        >
          {isLoading ? <Loader2 className="animate-spin" /> : <>Cluster Keywords <Layers size={18} /></>}
        </button>
      </div>

      <div className="space-y-6">
        {result ? (
          <div className="grid grid-cols-1 gap-6 animate-in fade-in slide-in-from-right-4 duration-500">
            {result.clusters.map((cluster: any, i: number) => (
              <div key={i} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${
                      cluster.intent === 'Buying' ? 'bg-green-500' : 
                      cluster.intent === 'Browsing' ? 'bg-blue-500' : 'bg-red-500'
                    }`} />
                    <h3 className="font-bold text-slate-800 text-lg">{cluster.intent} Intent</h3>
                  </div>
                  <span className="text-xs font-bold px-2 py-1 bg-slate-100 rounded text-slate-500 uppercase tracking-wider">
                    {cluster.strategy}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2 mb-4">
                  {cluster.keywords.map((kw: string, j: number) => (
                    <span key={j} className="px-3 py-1 bg-slate-50 text-slate-600 rounded-lg text-xs border border-slate-100">
                      {kw}
                    </span>
                  ))}
                </div>
                <p className="text-sm text-slate-500 italic border-t border-slate-50 pt-3">
                  Strategy: {cluster.strategy}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="h-full min-h-[500px] bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center text-slate-400 p-12 text-center">
             <Filter size={48} className="mb-4 text-slate-200" />
             <p className="max-w-xs">Organize your keyword research into logical campaign structures based on user search intent.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default KeywordClusterTool;

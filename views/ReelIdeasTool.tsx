
import React, { useState } from 'react';
import { gemini, Schemas } from '../services/geminiService';
import { Video, Loader2, Play, Music, MessageCircle, Send, ArrowRight } from 'lucide-react';

const ReelIdeasTool: React.FC = () => {
  const [product, setProduct] = useState('');
  const [audience, setAudience] = useState('');
  const [platform, setPlatform] = useState('Instagram Reels');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleGenerate = async () => {
    if (!product || !audience) return;
    setIsLoading(true);

    const prompt = `Generate high-reach social media ideas for:
    Product: ${product}
    Audience: ${audience}
    Platform: ${platform}
    
    Required Output:
    1. 10 thumb-stopping hooks.
    2. 3 detailed 30-sec scripts with visual instructions.
    3. Strong Call-to-Action (CTA) ideas.`;

    try {
      const data = await gemini.generateStructuredContent(prompt, Schemas.REEL_PLANNER);
      setResult(data);
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
          <div>
            <label className="text-sm font-bold text-slate-700 mb-2 uppercase block">The Product</label>
            <input 
              className="w-full p-4 bg-black border-2 border-slate-800 rounded-2xl text-white placeholder-slate-600"
              placeholder="e.g. Pure cotton kids frock with floral prints"
              value={product}
              onChange={(e) => setProduct(e.target.value)}
            />
          </div>
          <div>
            <label className="text-sm font-bold text-slate-700 mb-2 uppercase block">The Audience</label>
            <input 
              className="w-full p-4 bg-black border-2 border-slate-800 rounded-2xl text-white placeholder-slate-600"
              placeholder="e.g. Millennial moms in urban cities"
              value={audience}
              onChange={(e) => setAudience(e.target.value)}
            />
          </div>
          <div>
            <label className="text-sm font-bold text-slate-700 mb-2 uppercase block">Platform</label>
            <select 
              value={platform}
              onChange={(e) => setPlatform(e.target.value)}
              className="w-full p-4 bg-black border-2 border-slate-800 rounded-2xl text-white appearance-none"
            >
              <option className="bg-slate-900">Instagram Reels</option>
              <option className="bg-slate-900">YouTube Shorts</option>
              <option className="bg-slate-900">TikTok Ads</option>
            </select>
          </div>

          <button 
            onClick={handleGenerate}
            disabled={isLoading || !product || !audience}
            className="w-full py-4 bg-cyan-600 text-white font-bold rounded-2xl hover:bg-cyan-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-cyan-100"
          >
            {isLoading ? <Loader2 className="animate-spin" /> : <>Viral Plan <Send size={18} /></>}
          </button>
        </div>
      </div>

      <div className="lg:col-span-7 space-y-8 overflow-y-auto max-h-[800px] pr-2 custom-scrollbar">
        {result ? (
          <div className="animate-in fade-in duration-700 space-y-8">
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
              <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                <Music className="text-cyan-500" size={24} /> 10 Viral Hooks
              </h3>
              <div className="space-y-3">
                {result.hooks.map((hook: string, i: number) => (
                  <div key={i} className="flex gap-4 p-4 bg-slate-50 rounded-2xl group hover:bg-white hover:border-cyan-200 border border-transparent transition-all">
                    <span className="font-bold text-cyan-500">#{i+1}</span>
                    <p className="text-slate-600 font-medium">{hook}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <Play className="text-cyan-500" size={24} /> Ad Scripts
              </h3>
              {result.scripts.map((item: any, i: number) => (
                <div key={i} className="bg-slate-900 rounded-3xl p-8 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Video size={100} className="text-white" />
                  </div>
                  <div className="relative z-10">
                    <div className="flex justify-between items-center mb-6">
                      <span className="px-3 py-1 bg-cyan-500/20 text-cyan-400 rounded-full text-xs font-bold uppercase">
                        Script {i+1} • {item.duration}
                      </span>
                    </div>
                    <p className="text-slate-200 leading-relaxed italic mb-8">"{item.script}"</p>
                    <div className="flex items-center gap-3 p-4 bg-slate-800 rounded-2xl">
                      <MessageCircle size={18} className="text-cyan-400" />
                      <div className="flex-1">
                        <p className="text-xs text-slate-500 uppercase font-bold tracking-widest">CTA Recommendation</p>
                        <p className="text-white font-bold">{item.cta}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="h-full min-h-[500px] bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center text-slate-400 p-12 text-center">
             <div className="p-4 bg-white rounded-full mb-4 shadow-sm">
               <Video size={48} className="text-cyan-200" />
             </div>
             <h3 className="text-xl font-bold text-slate-600 mb-2">Create Viral Content</h3>
             <p className="max-w-xs">Don't guess what's trending. Get data-backed hooks and scripts that resonate with your specific audience.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReelIdeasTool;

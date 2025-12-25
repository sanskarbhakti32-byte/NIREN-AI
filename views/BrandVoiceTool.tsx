
import React, { useState } from 'react';
import { gemini } from '../services/geminiService';
import { Target, Loader2, Sparkles, Wand2 } from 'lucide-react';

const BrandVoiceTool: React.FC = () => {
  const [examples, setExamples] = useState('');
  const [testPrompt, setTestPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [trainedVoice, setTrainedVoice] = useState('');

  const handleTrain = async () => {
    if (!examples || !testPrompt) return;
    setIsLoading(true);

    const prompt = `You are a Brand Voice Engine. First, analyze these existing brand assets (ads, listings, captions):
    ${examples}
    
    Now, using that EXACT tone, style, and vocabulary, generate content for:
    ${testPrompt}`;

    try {
      const stream = await gemini.streamText(prompt, "You are a master brand strategist. You mimic brand personalities with 100% accuracy.");
      let fullText = '';
      for await (const chunk of stream) {
        fullText += chunk.text;
        setTrainedVoice(fullText);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <label className="text-sm font-bold text-slate-700 mb-2 uppercase tracking-widest flex items-center gap-2">
            1. Feed AI your Style Examples
          </label>
          <textarea 
            className="w-full h-48 p-4 bg-black border-2 border-slate-800 rounded-2xl mb-4 text-sm text-white placeholder-slate-600"
            placeholder="Paste your past high-performing ads, Instagram captions, or newsletters here..."
            value={examples}
            onChange={(e) => setExamples(e.target.value)}
          />

          <label className="text-sm font-bold text-slate-700 mb-2 uppercase tracking-widest flex items-center gap-2">
            2. Content to Generate
          </label>
          <input 
            className="w-full p-4 bg-black border-2 border-slate-800 rounded-2xl mb-6 text-white placeholder-slate-600"
            placeholder="e.g. A product launch caption for a new summer frock"
            value={testPrompt}
            onChange={(e) => setTestPrompt(e.target.value)}
          />

          <button 
            onClick={handleTrain}
            disabled={isLoading || !examples || !testPrompt}
            className="w-full py-4 bg-pink-600 text-white font-bold rounded-2xl hover:bg-pink-700 transition-all flex items-center justify-center gap-2"
          >
            {isLoading ? <Loader2 className="animate-spin" /> : <>Generate in Brand Voice <Target size={18} /></>}
          </button>
        </div>
      </div>

      <div className="bg-slate-900 rounded-3xl p-8 shadow-2xl min-h-[500px] flex flex-col">
        <div className="flex items-center gap-2 mb-6 border-b border-slate-800 pb-4">
          <Wand2 className="text-pink-500" size={18} />
          <span className="text-slate-400 font-bold uppercase tracking-widest text-sm">Perfected Output</span>
        </div>
        
        <div className="flex-1 text-slate-300 leading-relaxed font-medium overflow-y-auto">
          {trainedVoice ? (
            <div className="whitespace-pre-wrap">{trainedVoice}</div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-slate-600 space-y-4">
              <Sparkles size={48} />
              <p className="text-center max-w-xs italic">Once trained, your content will sound exactly like your brand, every single time.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BrandVoiceTool;

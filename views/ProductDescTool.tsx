
import React, { useState } from 'react';
import { gemini } from '../services/geminiService';
import { Send, Copy, Check, Globe, Sparkles } from 'lucide-react';

const ProductDescTool: React.FC = () => {
  const [productInfo, setProductInfo] = useState('');
  const [platform, setPlatform] = useState('Amazon');
  const [tone, setTone] = useState('Professional & Informative');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState('');
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    if (!productInfo.trim()) return;
    setIsLoading(true);
    setResult('');
    
    const prompt = `Generate a highly optimized e-commerce product description for ${platform}.
    Product Info: ${productInfo}
    Tone: ${tone}
    Rules: 
    1. Include SEO keywords naturally.
    2. Use bullet points for features.
    3. Maximum length 2000 characters.
    4. Focus on benefits, not just features.
    
    Format the output with clear headers and bullet points.`;

    try {
      const stream = await gemini.streamText(prompt, `You are an expert e-commerce copywriter specialized in ${platform}.`);
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

  const copyToClipboard = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">Product Information</label>
          <textarea 
            className="w-full h-48 p-4 bg-black border-2 border-slate-800 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none resize-none transition-all text-white placeholder-slate-500"
            placeholder="Paste raw features, material details, and size info here..."
            value={productInfo}
            onChange={(e) => setProductInfo(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Platform</label>
            <select 
              value={platform}
              onChange={(e) => setPlatform(e.target.value)}
              className="w-full p-3 bg-black border-2 border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-white appearance-none"
            >
              <option className="bg-slate-900">Amazon</option>
              <option className="bg-slate-900">Ajio</option>
              <option className="bg-slate-900">Meesho</option>
              <option className="bg-slate-900">Flipkart</option>
              <option className="bg-slate-900">Shopify</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Brand Tone</label>
            <select 
              value={tone}
              onChange={(e) => setTone(e.target.value)}
              className="w-full p-3 bg-black border-2 border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-white appearance-none"
            >
              <option className="bg-slate-900">Professional & Informative</option>
              <option className="bg-slate-900">Luxury & Premium</option>
              <option className="bg-slate-900">Playful & Friendly</option>
              <option className="bg-slate-900">Urgent & Salesy</option>
              <option className="bg-slate-900">Minimalist</option>
            </select>
          </div>
        </div>

        <button 
          onClick={handleGenerate}
          disabled={isLoading || !productInfo}
          className="w-full py-4 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-100"
        >
          {isLoading ? (
            <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <>
              <Send size={18} />
              Generate Description
            </>
          )}
        </button>
      </div>

      <div className="bg-slate-900 rounded-3xl p-6 relative flex flex-col min-h-[500px] shadow-2xl">
        <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <Globe className="text-slate-400" size={16} />
            <span className="text-slate-400 text-sm font-medium">Preview Output</span>
          </div>
          {result && (
            <button 
              onClick={copyToClipboard}
              className="flex items-center gap-2 text-indigo-400 hover:text-indigo-300 transition-colors text-sm font-bold"
            >
              {copied ? <Check size={16} /> : <Copy size={16} />}
              {copied ? 'Copied!' : 'Copy'}
            </button>
          )}
        </div>
        
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {result ? (
            <div className="prose prose-invert prose-slate max-w-none text-slate-300">
              <pre className="whitespace-pre-wrap font-sans leading-relaxed">
                {result}
              </pre>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-slate-600 space-y-4">
              <div className="p-4 bg-slate-800 rounded-full">
                <Sparkles size={32} className="text-slate-500" />
              </div>
              <p>Generated description will appear here...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDescTool;

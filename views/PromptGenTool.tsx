
import React, { useState } from 'react';
import FileUploader from '../components/FileUploader';
import { gemini, Schemas } from '../services/geminiService';
// Added Zap to the imports
import { Loader2, Copy, Sparkles, Image as ImageIcon, Video, Zap } from 'lucide-react';

const PromptGenTool: React.FC = () => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [tone, setTone] = useState('Luxury');
  const [isLoading, setIsLoading] = useState(false);
  const [prompts, setPrompts] = useState<{ image: string[], video: string[] } | null>(null);

  const handleFileSelect = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleGenerate = async () => {
    if (!imagePreview) return;
    setIsLoading(true);

    const prompt = `Analyze this product and create high-converting image and video prompts for AI generation (Midjourney/Runway/Veo).
    Brand Tone: ${tone}
    Include:
    - 2 ultra-realistic image prompts.
    - 1 cinematic video prompt with motion descriptions.
    - Lighting and composition details.
    
    Respond with a JSON object matching the requested schema.`;

    try {
      // Fixed: Property 'analyzeImage' does not exist on type 'GeminiService'. Fixed to 'analyzeImages' and passed image as array.
      const data = await gemini.analyzeImages([imagePreview], prompt, Schemas.PROMPT_GEN);
      setPrompts(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      <div className="lg:col-span-5 space-y-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <FileUploader 
            onFileSelect={handleFileSelect}
            previewUrl={imagePreview || undefined}
            onClear={() => setImagePreview(null)}
            label="Upload Sample Product"
          />
          
          <div className="mt-6">
            <label className="block text-sm font-bold text-slate-700 mb-2 uppercase">Target Aesthetic</label>
            <div className="grid grid-cols-3 gap-2">
              {['Luxury', 'Playful', 'Minimalist', 'Urban', 'Cozy', 'Vibrant'].map((t) => (
                <button
                  key={t}
                  onClick={() => setTone(t)}
                  className={`py-2 px-3 rounded-xl text-xs font-bold transition-all border ${
                    tone === t 
                      ? 'bg-yellow-100 border-yellow-300 text-yellow-800' 
                      : 'bg-slate-50 border-slate-100 text-slate-500 hover:bg-slate-100'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <button 
            onClick={handleGenerate}
            disabled={isLoading || !imagePreview}
            className="w-full mt-6 py-4 bg-yellow-500 text-white font-bold rounded-2xl hover:bg-yellow-600 disabled:opacity-50 transition-all flex items-center justify-center gap-2 shadow-lg shadow-yellow-100"
          >
            {isLoading ? <Loader2 className="animate-spin" /> : <>Generate AI Prompts <Sparkles size={18} /></>}
          </button>
        </div>
      </div>

      <div className="lg:col-span-7 space-y-6">
        {prompts ? (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <ImageIcon size={16} className="text-yellow-500" /> Image Gen Prompts
              </h3>
              {prompts.image.map((p, i) => (
                <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 relative group">
                  <p className="text-slate-700 italic leading-relaxed text-sm pr-8">"{p}"</p>
                  <button 
                    onClick={() => navigator.clipboard.writeText(p)}
                    className="absolute top-4 right-4 p-2 text-slate-300 hover:text-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Copy size={16} />
                  </button>
                </div>
              ))}
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <Video size={16} className="text-yellow-500" /> Video Ad Prompt (Runway/Veo)
              </h3>
              {prompts.video.map((p, i) => (
                <div key={i} className="bg-slate-900 p-6 rounded-2xl border border-slate-800 relative group">
                  <p className="text-slate-300 italic leading-relaxed text-sm pr-8">"{p}"</p>
                  <button 
                    onClick={() => navigator.clipboard.writeText(p)}
                    className="absolute top-4 right-4 p-2 text-slate-500 hover:text-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Copy size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="h-full bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center text-slate-400 p-12 text-center">
             <div className="p-4 bg-white rounded-full mb-4">
               <Zap size={32} className="text-slate-200" />
             </div>
             <p className="max-w-xs">Upload your product photo to generate ultra-realistic AI prompts for your marketing campaigns.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PromptGenTool;

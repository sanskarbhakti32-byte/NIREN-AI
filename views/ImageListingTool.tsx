
import React, { useState, useRef } from 'react';
import { gemini, Schemas } from '../services/geminiService';
import { Loader2, Tag, List, Info, AlertCircle, Camera, Upload, X, Plus, Hash, Ruler, Scissors, Type as TypeIcon, ChevronDown, MoveRight, Copy, Check, FileText, Search, Ban, Repeat, Layers } from 'lucide-react';

const MAX_IMAGES = 5;

const FABRIC_OPTIONS = [
  "Cotton", "Silk", "Linen", "Polyester", "Rayon", "Satin", "Denim", "Velvet", "Chiffon", "Wool", "Nylon", "Spandex"
];

const LENGTH_OPTIONS = [
  "Mini", "Knee Length", "Midi", "Maxi", "Full Length", "Ankle Length", "Cropped", "Regular"
];

const NECK_STYLES = [
  "Round Neck", "V-Neck", "Crew Neck", "Polo", "Turtle Neck", "Mandarin Collar", "Boat Neck", "Halter Neck", "Off-Shoulder", "Sweetheart", "Square Neck"
];

const SIZE_OPTIONS = [
  "0-6 Months", "6-12 Months", "12-18 Months", "18-24 Months", "1-2 Years", "2-3 Years", "3-4 Years", "4-5 Years", "5-6 Years", "6-7 Years", "7-8 Years", "8-9 Years", "9-10 Years", "10-11 Years", "11-12 Years", "12-13 Years", "13-14 Years", "14-15 Years", "Free Size"
];

const TARGET_KEYWORDS = "baby girl night dress, nighty for girls, 6 month baby girl dress, girls ethnic wear, girls clothes, black dress for girls, beach dresses, girls night dress, three piece, girls wear, girls dresses, western dresses for girls, kids dress for girls, hopscotch girls dress, night dresses for girls, 5 years girls dress, kids girl dress, kids dress, long dress for girls, wedding dress for girls, party wear dress for girls, baby cotton dress, fancy dress for girls, stylish dress for girls, middies for girls, fashion dream, birthday dress for girls, traditional dress for girls, cotton frock for girls, baby frock, girls frock, kids nighty for girls, children's dress, frock for girls, jeans top for girls, short dress for girls, modern dress for girls, frock for girls 7-8 years, babies dress, kids dresses, cotton frocks, girl frock, kids daily wear for girls, 12 years girls dresses, 14 years girls dresses, outfit for girls, girls frocks, girls fancy dress, party dress for girls, cotton dress for girls, kids wear, girl clothes, beach dress for kids girls, 3 year old girl dress, dresses for kids girls, western wear for kids girls, summer dress for girls, casual dress for girls, birthday dresses for kids, frocks for kids, kids frock, cinderella dress, sharara set for girls, ethnic wear for kids girls, lehenga choli for girls, denim dress for girls, ethnic dresses for girls, dungarees for girls, indowestern dress for girls, traditional wear for girls, yellow dress for kids, lacha for kids girls, rainbow frock for girls, floral dress for girls, polka dot dress for kids girls";

interface ProductSpecs {
  brandName: string;
  minSize: string;
  maxSize: string;
  fabric: string;
  length: string;
  neckStyle: string;
}

const ImageListingTool: React.FC = () => {
  const [images, setImages] = useState<string[]>([]);
  const [specs, setSpecs] = useState<ProductSpecs>({
    brandName: '',
    minSize: '',
    maxSize: '',
    fabric: '',
    length: '',
    neckStyle: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [copiedSection, setCopiedSection] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getIntermediateSizes = () => {
    if (!specs.minSize || !specs.maxSize) return [];
    const startIdx = SIZE_OPTIONS.indexOf(specs.minSize);
    const endIdx = SIZE_OPTIONS.indexOf(specs.maxSize);
    if (startIdx === -1 || endIdx === -1) return [];
    
    const lower = Math.min(startIdx, endIdx);
    const upper = Math.max(startIdx, endIdx);
    return SIZE_OPTIONS.slice(lower, upper + 1);
  };

  const intermediateSizes = getIntermediateSizes();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) as File[] : [];
    const remainingSlots = MAX_IMAGES - images.length;
    const filesToProcess = files.slice(0, remainingSlots);

    filesToProcess.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => setImages(prev => [...prev, reader.result as string]);
      reader.readAsDataURL(file);
    });
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    if (images.length === 1) setResult(null);
  };

  const handleSpecChange = (field: keyof ProductSpecs, value: string) => {
    setSpecs(prev => ({ ...prev, [field]: value }));
  };

  const copyToClipboard = (text: string, section: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(section);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const handleAnalyze = async () => {
    if (images.length === 0) return;
    setIsLoading(true);

    const sizes = getIntermediateSizes();
    const ageNumbersOnly = sizes.map(s => s.match(/\d+/g)?.[0]).filter(Boolean);
    const ageNumbers = ageNumbersOnly.join(' ');
    const agePhrases = sizes.map(s => `${s}`).join(', ');
    
    // Shorthand for Title: e.g. "1 to 9 Years"
    const titleRange = ageNumbersOnly.length > 1 
      ? `${ageNumbersOnly[0]} to ${ageNumbersOnly[ageNumbersOnly.length - 1]} Years`
      : sizes[0] || 'Analyze from image';

    const prompt = `Analyze these ${images.length} product images for an Amazon/E-commerce listing.
    
    CRITICAL BRAND DATA:
    - Brand: ${specs.brandName || 'Analyze from image'}
    - Fabric: ${specs.fabric || 'Analyze from image'}
    - Length: ${specs.length || 'Analyze from image'}
    - Neck: ${specs.neckStyle || 'Analyze from image'}

    MANDATORY VARIATION SEO MAPPING (FULL RANGE INDEXING):
    The user has selected a range from ${specs.minSize} to ${specs.maxSize}. 
    To ensure every middle size variation is indexed, you MUST explicitly integrate all these specific age variations:
    [ ${agePhrases} ]

    SEO KEYWORDS TO USE:
    ${TARGET_KEYWORDS}

    STRICT OUTPUT RULES:
    1. TITLE: 150-200 characters. Start with Brand. 
       - YOU MUST EXPLICITLY INCLUDE THE AGE RANGE SUMMARY: "${titleRange}" in the title to show it covers all variations.
    2. BULLET POINTS: 5 points (160-199 chars each). 
       - Distribute ALL intermediate age variations across the 5 points.
       - Each bullet must be high-density and specific about ${specs.fabric} and detected design details.
    3. BACKEND KEYWORDS: STRICT UNDER 200 CHARS.
       - Use a space-separated string.
       - MUST include all age numbers: "${ageNumbers} years girl dress".
       - Include detected color, fabric, and unique keywords from the target list. 
       - NO COMMAS. NO REPEATS.
    4. DESCRIPTION: 3-paragraph SEO copy. Mention: "Perfectly fits girls aged ${agePhrases}."`;

    try {
      const data = await gemini.analyzeImages(images, prompt, Schemas.LISTING_ANALYSIS);
      setResult({ ...data, indexedVariations: sizes });
    } catch (error) {
      console.error(error);
      alert("Analysis failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Left Column: Input & Configuration */}
      <div className="lg:col-span-4 space-y-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <label className="text-sm font-bold text-slate-700 mb-4 block uppercase tracking-wide">
            Product Images ({images.length}/{MAX_IMAGES})
          </label>
          <div className="grid grid-cols-2 gap-3 mb-6">
            {images.map((src, idx) => (
              <div key={idx} className="relative group aspect-square rounded-2xl overflow-hidden border border-slate-200 bg-slate-50">
                <img src={src} className="w-full h-full object-cover" />
                <button onClick={() => removeImage(idx)} className="absolute top-2 right-2 p-1.5 bg-white/90 text-red-500 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50">
                  <X size={14} />
                </button>
              </div>
            ))}
            {images.length < MAX_IMAGES && (
              <button onClick={() => fileInputRef.current?.click()} className="aspect-square rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 hover:border-indigo-400 hover:bg-indigo-50 transition-all group">
                <Plus size={24} className="group-hover:scale-110 transition-transform" />
                <span className="text-[10px] font-bold mt-1 uppercase">Add View</span>
              </button>
            )}
          </div>
          <input type="file" ref={fileInputRef} onChange={handleFileSelect} multiple accept="image/*" className="hidden" />

          <div className="pt-4 border-t border-slate-100 space-y-4">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2"><TypeIcon size={12} /> Optimization Data</h4>
            <div className="space-y-3">
              <input 
                type="text" 
                placeholder="Brand Name" 
                className="w-full px-4 py-2.5 bg-black border-2 border-slate-800 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none text-white placeholder-slate-500" 
                value={specs.brandName} 
                onChange={(e) => handleSpecChange('brandName', e.target.value)} 
              />
              
              <div className="bg-slate-900 p-3 rounded-2xl border border-slate-800">
                <div className="flex justify-between items-center mb-2">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Full Variation Range</p>
                  {intermediateSizes.length > 0 && (
                    <span className="text-[9px] font-bold bg-indigo-500/20 text-indigo-400 px-2 py-0.5 rounded-full">
                      {intermediateSizes.length} Sizes Indexed
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <select 
                    className="w-full p-2 bg-black border-2 border-slate-800 rounded-lg text-xs outline-none text-white focus:border-indigo-500" 
                    value={specs.minSize} 
                    onChange={(e) => handleSpecChange('minSize', e.target.value)}
                  >
                    <option value="" className="bg-slate-900">Start Age</option>
                    {SIZE_OPTIONS.map(opt => <option key={opt} value={opt} className="bg-slate-900">{opt}</option>)}
                  </select>
                  <MoveRight size={14} className="text-slate-500" />
                  <select 
                    className="w-full p-2 bg-black border-2 border-slate-800 rounded-lg text-xs outline-none text-white focus:border-indigo-500" 
                    value={specs.maxSize} 
                    onChange={(e) => handleSpecChange('maxSize', e.target.value)}
                  >
                    <option value="" className="bg-slate-900">End Age</option>
                    {SIZE_OPTIONS.map(opt => <option key={opt} value={opt} className="bg-slate-900">{opt}</option>)}
                  </select>
                </div>
                {intermediateSizes.length > 2 && (
                  <div className="mt-3 flex flex-wrap gap-1">
                    {intermediateSizes.slice(1, -1).map((s, i) => (
                      <span key={i} className="text-[9px] text-slate-500 bg-slate-800 px-1.5 rounded-md border border-slate-700">
                        {s}
                      </span>
                    ))}
                    {intermediateSizes.length > 5 && <span className="text-[9px] text-slate-600">+{intermediateSizes.length - 5} more</span>}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-2">
                <select 
                  className="w-full p-2.5 bg-black border-2 border-slate-800 rounded-xl text-sm outline-none text-white focus:border-indigo-500" 
                  value={specs.neckStyle} 
                  onChange={(e) => handleSpecChange('neckStyle', e.target.value)}
                >
                  <option value="" className="bg-slate-900">Neck Style</option>
                  {NECK_STYLES.map(style => <option key={style} value={style} className="bg-slate-900">{style}</option>)}
                </select>
                <select 
                  className="w-full p-2.5 bg-black border-2 border-slate-800 rounded-xl text-sm outline-none text-white focus:border-indigo-500" 
                  value={specs.length} 
                  onChange={(e) => handleSpecChange('length', e.target.value)}
                >
                  <option value="" className="bg-slate-900">Length</option>
                  {LENGTH_OPTIONS.map(opt => <option key={opt} value={opt} className="bg-slate-900">{opt}</option>)}
                </select>
              </div>

              <select 
                className="w-full p-2.5 bg-black border-2 border-slate-800 rounded-xl text-sm outline-none text-white focus:border-indigo-500" 
                value={specs.fabric} 
                onChange={(e) => handleSpecChange('fabric', e.target.value)}
              >
                <option value="" className="bg-slate-900">Choose Fabric</option>
                {FABRIC_OPTIONS.map(f => <option key={f} value={f} className="bg-slate-900">{f}</option>)}
              </select>
            </div>
          </div>
          <button onClick={handleAnalyze} disabled={isLoading || images.length === 0} className="w-full mt-6 py-4 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 disabled:opacity-50 transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-100">
            {isLoading ? <Loader2 className="animate-spin" /> : <>Full Variation Indexing <Layers size={18} /></>}
          </button>
        </div>
      </div>

      {/* Right Column: Generation Results */}
      <div className="lg:col-span-8 space-y-6">
        {result ? (
          <div className="space-y-6 animate-in fade-in duration-700">
            {/* Title Result */}
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden">
              <div className="flex justify-between items-start mb-4">
                <div className="flex flex-col gap-1">
                  <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Optimized Product Title</h3>
                  <div className="flex flex-wrap gap-2 mt-1">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${result.title?.length < 150 ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>
                      {result.title?.length || 0} / 200 Characters
                    </span>
                  </div>
                </div>
                <button onClick={() => copyToClipboard(result.title, 'title')} className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                  {copiedSection === 'title' ? <Check size={16} /> : <Copy size={16} />}
                </button>
              </div>
              <p className="text-2xl font-bold text-slate-800 leading-tight relative z-10">{result.title}</p>
            </div>

            {/* Bullets & Indexing Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                  <List size={16} className="text-indigo-500" /> High-Density Bullet Points
                </h3>
                <ul className="space-y-6">
                  {result.bullets.map((bullet: string, i: number) => (
                    <li key={i} className="flex flex-col gap-1 text-slate-600 leading-relaxed group relative">
                      <div className="flex gap-3">
                        <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-indigo-400 flex-shrink-0 group-hover:scale-125 transition-transform" />
                        <span className="flex-1 text-sm font-medium pr-8">{bullet}</span>
                        <button 
                          onClick={() => copyToClipboard(bullet, `bullet-${i}`)}
                          className="absolute top-0 right-0 p-1.5 text-slate-300 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                        >
                          {copiedSection === `bullet-${i}` ? <Check size={14} /> : <Copy size={14} />}
                        </button>
                      </div>
                      <div className="flex items-center gap-2 ml-4 mt-1">
                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${bullet.length < 160 || bullet.length > 199 ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'}`}>
                          {bullet.length} Characters
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-6">
                <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
                  <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2 mb-6">
                    <Hash size={16} className="text-indigo-500" /> Variations Indexed
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {result.indexedVariations?.map((v: string, i: number) => (
                      <span key={i} className="px-3 py-1 bg-indigo-50 text-indigo-700 border border-indigo-100 rounded-lg text-xs font-bold">
                        {v}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                      <Search size={16} className="text-indigo-500" /> Target SEO List
                    </h3>
                  </div>
                  <div className="flex flex-wrap gap-2 max-h-[120px] overflow-y-auto custom-scrollbar">
                    {result.keywords.map((kw: string, i: number) => (
                      <span key={i} className="px-2 py-0.5 bg-slate-50 border border-slate-100 text-slate-500 rounded text-[10px] font-bold uppercase">
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Backend Keywords Block */}
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
              <div className="flex justify-between items-start mb-6">
                <div className="flex flex-col gap-1">
                  <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <Search size={16} className="text-indigo-500" /> Amazon Backend Keywords (UNDER 200)
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${result.backendKeywords?.length > 199 ? 'bg-red-100 text-red-700 font-black' : 'bg-emerald-100 text-emerald-700'}`}>
                      {result.backendKeywords?.length || 0} / 200 Max Characters
                    </span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Full Variation Metric Integrated</span>
                  </div>
                </div>
                <button onClick={() => copyToClipboard(result.backendKeywords, 'backend')} className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold text-indigo-600 hover:bg-indigo-50 rounded-lg border border-indigo-100 transition-colors">
                  {copiedSection === 'backend' ? <><Check size={14} /> Copied</> : <><Copy size={14} /> Copy Backend</>}
                </button>
              </div>
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-slate-600 font-mono text-sm leading-relaxed break-words select-all">
                {result.backendKeywords}
              </div>
            </div>

            {/* SEO Description */}
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
              <div className="flex justify-between items-start mb-6">
                <div className="flex flex-col gap-1">
                  <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <FileText size={16} className="text-indigo-500" /> Full Listing Description
                  </h3>
                  <span className="text-[10px] font-bold text-slate-400 px-2 py-0.5 bg-slate-100 rounded-full">{result.description?.length || 0} / 1500 Max Characters</span>
                </div>
                <button onClick={() => copyToClipboard(result.description, 'desc')} className="text-xs font-bold text-indigo-600 hover:bg-indigo-50 px-3 py-1.5 rounded-lg border border-indigo-100 transition-colors">
                  {copiedSection === 'desc' ? 'Copied Description' : 'Copy Description'}
                </button>
              </div>
              <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed whitespace-pre-wrap text-sm">
                {result.description}
              </div>
            </div>
          </div>
        ) : (
          <div className="h-full min-h-[400px] bg-slate-100/30 border-2 border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center text-slate-400 text-center px-12">
            <div className="p-6 bg-white rounded-full shadow-sm mb-6">
              <Camera size={48} className="text-slate-200" />
            </div>
            <h3 className="text-xl font-bold text-slate-600 mb-2">Variation Listing Architect</h3>
            <p className="max-w-md text-sm">Upload images and select a size range. Our algorithm will extract every intermediate variation and force the AI to index them for peak Amazon visibility.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageListingTool;

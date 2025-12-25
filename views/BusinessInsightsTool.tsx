
import React, { useState } from 'react';
import { gemini, Schemas } from '../services/geminiService';
import { 
  TrendingUp, 
  Loader2, 
  BarChart3, 
  ArrowUpRight, 
  ArrowDownRight, 
  Lightbulb, 
  CheckCircle2 
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';

const mockChartData = [
  { name: 'Mon', sales: 4000, spend: 2400 },
  { name: 'Tue', sales: 3000, spend: 1398 },
  { name: 'Wed', sales: 2000, spend: 9800 },
  { name: 'Thu', sales: 2780, spend: 3908 },
  { name: 'Fri', sales: 1890, spend: 4800 },
  { name: 'Sat', sales: 2390, spend: 3800 },
  { name: 'Sun', sales: 3490, spend: 4300 },
];

const BusinessInsightsTool: React.FC = () => {
  const [dataInput, setDataInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleAnalyze = async () => {
    if (!dataInput) return;
    setIsLoading(true);

    const prompt = `Analyze this daily sales and ad performance data:
    ${dataInput}
    
    Explain what happened in plain English:
    1. Overall trend (Why did sales drop/rise?).
    2. Specific keyword performance.
    3. Action items (Pause this, scale that).
    4. Metrics interpretation (CTR vs CR).`;

    try {
      const data = await gemini.generateStructuredContent(prompt, Schemas.BUSINESS_INSIGHTS);
      setResult(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <h3 className="text-sm font-bold text-slate-700 mb-4 uppercase tracking-widest flex items-center gap-2">
            <BarChart3 size={18} className="text-emerald-500" /> Sales & Ad Data Input
          </h3>
          <textarea 
            className="w-full h-48 p-4 bg-slate-50 border border-slate-200 rounded-2xl mb-4 text-xs font-mono"
            placeholder="Paste your CSV data or stats from Seller Central here..."
            value={dataInput}
            onChange={(e) => setDataInput(e.target.value)}
          />
          <button 
            onClick={handleAnalyze}
            disabled={isLoading || !dataInput}
            className="w-full py-4 bg-emerald-600 text-white font-bold rounded-2xl hover:bg-emerald-700 transition-all flex items-center justify-center gap-2"
          >
            {isLoading ? <Loader2 className="animate-spin" /> : 'Get Insights'}
          </button>
        </div>

        <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm h-[320px]">
           <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={mockChartData}>
              <defs>
                <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
              <Tooltip 
                contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}} 
                itemStyle={{fontWeight: 'bold'}}
              />
              <Area type="monotone" dataKey="sales" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorSales)" />
              <Area type="monotone" dataKey="spend" stroke="#f43f5e" strokeWidth={2} fillOpacity={0} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {result && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-6 duration-700">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
              <h3 className="font-bold text-slate-800 text-xl mb-4 flex items-center gap-2">
                <TrendingUp size={24} className="text-emerald-500" /> English Summary
              </h3>
              <p className="text-slate-600 leading-relaxed text-lg italic">
                "{result.summary}"
              </p>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
              <h3 className="font-bold text-slate-800 text-xl mb-6">Deep Dive Metrics</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {result.metricsInterpretation.map((metric: string, i: number) => (
                  <div key={i} className="flex gap-3 p-4 bg-slate-50 rounded-2xl">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-2 flex-shrink-0" />
                    <p className="text-sm text-slate-600 leading-snug">{metric}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-emerald-900 p-8 rounded-3xl shadow-xl flex flex-col">
            <h3 className="text-emerald-200 font-bold text-xl mb-8 flex items-center gap-2">
              <CheckCircle2 size={24} /> Action Checklist
            </h3>
            <div className="space-y-6 flex-1">
              {result.actionItems.map((item: string, i: number) => (
                <div key={i} className="group flex items-start gap-4">
                  <div className="w-6 h-6 rounded-lg bg-emerald-800 border border-emerald-700 flex items-center justify-center text-emerald-400 group-hover:bg-emerald-700 transition-colors cursor-pointer">
                    {i + 1}
                  </div>
                  <p className="text-white font-medium text-sm leading-relaxed">{item}</p>
                </div>
              ))}
            </div>
            <div className="mt-8 pt-8 border-t border-emerald-800">
               <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-widest">
                 <ArrowUpRight size={14} /> Optimization Potential: High
               </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BusinessInsightsTool;

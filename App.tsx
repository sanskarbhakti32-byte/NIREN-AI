
import React, { useState, useEffect } from 'react';
import { 
  Menu, 
  X, 
  LayoutDashboard, 
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { ToolID, Tool } from './types';
import { TOOLS, ICON_MAP } from './constants';
import ToolShell from './components/ToolShell';

// Dynamic Imports would be better but we'll use a switch for simplicity in one file
import ProductDescTool from './views/ProductDescTool';
import ImageListingTool from './views/ImageListingTool';
import AdsWasteTool from './views/AdsWasteTool';
import PromptGenTool from './views/PromptGenTool';
import ProblemFinderTool from './views/ProblemFinderTool';
import KeywordClusterTool from './views/KeywordClusterTool';
import ReviewAnalyzerTool from './views/ReviewAnalyzerTool';
import BrandVoiceTool from './views/BrandVoiceTool';
import BusinessInsightsTool from './views/BusinessInsightsTool';
import ReelIdeasTool from './views/ReelIdeasTool';

const App: React.FC = () => {
  const [activeToolId, setActiveToolId] = useState<ToolID | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const activeTool = TOOLS.find(t => t.id === activeToolId);

  const renderTool = () => {
    switch (activeToolId) {
      case ToolID.ProductDesc: return <ProductDescTool />;
      case ToolID.ImageListing: return <ImageListingTool />;
      case ToolID.AdsWaste: return <AdsWasteTool />;
      case ToolID.PromptGen: return <PromptGenTool />;
      case ToolID.ProblemFinder: return <ProblemFinderTool />;
      case ToolID.KeywordCluster: return <KeywordClusterTool />;
      case ToolID.ReviewAnalyzer: return <ReviewAnalyzerTool />;
      case ToolID.BrandVoice: return <BrandVoiceTool />;
      case ToolID.BusinessInsights: return <BusinessInsightsTool />;
      case ToolID.ReelIdeas: return <ReelIdeasTool />;
      default: return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
          {TOOLS.map((tool) => (
            <button
              key={tool.id}
              onClick={() => setActiveToolId(tool.id)}
              className="group flex flex-col items-start p-6 bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-indigo-200 transition-all text-left"
            >
              <div className={`p-4 rounded-2xl mb-4 text-white transition-transform group-hover:scale-110 duration-300 ${tool.color}`}>
                {ICON_MAP[tool.icon]}
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">{tool.name}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{tool.description}</p>
              <div className="mt-4 flex items-center text-indigo-600 font-semibold text-sm group-hover:translate-x-1 transition-transform">
                Launch Tool <ChevronRight size={16} className="ml-1" />
              </div>
            </button>
          ))}
        </div>
      );
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      {/* Sidebar */}
      <aside 
        className={`${
          isSidebarOpen ? 'w-80' : 'w-20'
        } transition-all duration-300 bg-white border-r border-slate-200 flex flex-col z-50`}
      >
        <div className="p-6 flex items-center justify-between">
          <div className={`flex items-center gap-3 ${!isSidebarOpen && 'hidden'}`}>
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
              <Sparkles size={24} />
            </div>
            <h1 className="font-bold text-xl text-slate-800 tracking-tight">Niren <span className="text-indigo-600">AI</span></h1>
          </div>
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 hover:bg-slate-100 rounded-lg text-slate-500"
          >
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto custom-scrollbar">
          <button 
            onClick={() => setActiveToolId(null)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              activeToolId === null 
                ? 'bg-indigo-50 text-indigo-600 font-semibold' 
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <LayoutDashboard size={20} />
            {isSidebarOpen && <span>Dashboard</span>}
          </button>
          
          <div className={`pt-4 pb-2 px-4 text-xs font-bold text-slate-400 uppercase tracking-widest ${!isSidebarOpen && 'hidden'}`}>
            Tools
          </div>

          {TOOLS.map((tool) => (
            <button
              key={tool.id}
              onClick={() => setActiveToolId(tool.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                activeToolId === tool.id 
                  ? 'bg-indigo-50 text-indigo-600 font-semibold border-r-4 border-indigo-600' 
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <div className={`${activeToolId === tool.id ? 'text-indigo-600' : 'text-slate-400'}`}>
                {ICON_MAP[tool.icon]}
              </div>
              {isSidebarOpen && <span className="truncate">{tool.name}</span>}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-100">
          <div className={`flex items-center gap-3 p-3 bg-slate-50 rounded-2xl ${!isSidebarOpen && 'justify-center'}`}>
            <div className="w-8 h-8 rounded-full bg-slate-200 border-2 border-white overflow-hidden">
              <img src="https://picsum.photos/32/32?seed=seller" alt="User" />
            </div>
            {isSidebarOpen && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-slate-800 truncate">Premium Seller</p>
                <p className="text-xs text-slate-500 truncate">Pro Account</p>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto custom-scrollbar p-4 md:p-8">
        <header className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-indigo-600 uppercase tracking-widest mb-1">
              {activeToolId ? 'Optimization Suite' : 'Welcome back'}
            </h2>
            <h1 className="text-3xl font-extrabold text-slate-900">
              {activeToolId ? activeTool?.name : 'Grow Your Brand with AI'}
            </h1>
          </div>
          <div className="hidden md:flex items-center gap-4">
             <div className="px-4 py-2 bg-white rounded-full border border-slate-200 shadow-sm flex items-center gap-2 text-sm text-slate-600">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                API Connected: Gemini 3
             </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto">
          {activeToolId ? (
            <ToolShell tool={activeTool!}>
              {renderTool()}
            </ToolShell>
          ) : renderTool()}
        </div>
      </main>
    </div>
  );
};

export default App;

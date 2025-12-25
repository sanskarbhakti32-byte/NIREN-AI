
import React from 'react';
import { Tool } from '../types';
import { ICON_MAP } from '../constants';

interface ToolShellProps {
  tool: Tool;
  children: React.ReactNode;
}

const ToolShell: React.FC<ToolShellProps> = ({ tool, children }) => {
  return (
    <div className="flex flex-col h-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-6 flex items-center gap-4">
        <div className={`p-3 rounded-xl text-white ${tool.color} shadow-lg shadow-${tool.color.split('-')[1]}-200`}>
          {ICON_MAP[tool.icon]}
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-800">{tool.name}</h1>
          <p className="text-slate-500">{tool.description}</p>
        </div>
      </div>
      <div className="flex-1">
        {children}
      </div>
    </div>
  );
};

export default ToolShell;

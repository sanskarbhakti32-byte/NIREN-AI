
import React, { useRef } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';

interface FileUploaderProps {
  onFileSelect: (file: File) => void;
  previewUrl?: string;
  onClear: () => void;
  accept?: string;
  label?: string;
}

const FileUploader: React.FC<FileUploaderProps> = ({ 
  onFileSelect, 
  previewUrl, 
  onClear, 
  accept = "image/*", 
  label = "Upload Image" 
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileSelect(file);
    }
  };

  return (
    <div className="w-full">
      {!previewUrl ? (
        <div 
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-slate-300 rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer hover:border-indigo-500 hover:bg-indigo-50/50 transition-all group"
        >
          <div className="p-4 bg-slate-100 rounded-full group-hover:bg-indigo-100 mb-4 transition-colors">
            <Upload className="text-slate-500 group-hover:text-indigo-600" size={32} />
          </div>
          <p className="text-slate-600 font-medium">{label}</p>
          <p className="text-slate-400 text-sm mt-1">Click or drag to upload</p>
          <input 
            type="file" 
            className="hidden" 
            ref={fileInputRef} 
            onChange={handleFileChange}
            accept={accept}
          />
        </div>
      ) : (
        <div className="relative rounded-2xl overflow-hidden border border-slate-200 group shadow-sm">
          {previewUrl.startsWith('data:image') ? (
            <img src={previewUrl} alt="Preview" className="w-full h-48 object-cover" />
          ) : (
            <div className="w-full h-48 bg-slate-100 flex items-center justify-center">
              <ImageIcon className="text-slate-400" size={48} />
            </div>
          )}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <button 
              onClick={onClear}
              className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUploader;

import { FileUp } from 'lucide-react';

export default function UploadCard({
  handleFileUpload,
  isProcessing,
}) {
  return (
    
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200"
            onDragOver={(e) => { e.preventDefault(); }} 
            onDrop={(e) => {

              e.preventDefault();

              if (isProcessing) return;

              if (e.dataTransfer.files.length > 0) {

              handleFileUpload({
                target: {
                  files: e.dataTransfer.files
              }
            });
  }
}}
                
        >
            <h2 className="text-sm font-semibold text-indigo-600 uppercase tracking-wider mb-4 flex items-center gap-2">
            <FileUp size={16} /> 1. Upload Source File
            </h2>
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-slate-300 border-dashed rounded-lg cursor-pointer bg-slate-50 hover:bg-slate-100 transition-colors">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <FileUp className="w-8 h-8 mb-3 text-slate-400" />
                <p className="text-sm text-slate-600">Click to browse or drag PDF here</p>
            </div>
            <input type="file" className="hidden" accept="application/pdf" onChange={handleFileUpload} disabled={isProcessing}/>
            </label>
        </div>
  );
}
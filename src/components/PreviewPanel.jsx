import ReactCrop from 'react-image-crop';

import {
  ScanText,
  CheckCircle,
  Loader2,
} from 'lucide-react';

export default function PreviewPanel({
  previewImage,
  crop,
  setCrop,
  performOCR,
  isProcessing,
  imageRef,
}) {

  return (
    
          <div className="lg:col-span-7">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 min-h-[500px]">
              <h2 className="text-sm font-semibold text-indigo-600 uppercase tracking-wider mb-4 flex items-center gap-2">
                <ScanText size={16} /> 2. Define Extraction Area
              </h2>
              
              {!previewImage ? (
                <div className="flex flex-col items-center justify-center h-full text-slate-400 py-32 border-2 border-dashed border-slate-100 rounded-lg bg-slate-50/50">
                  <ScanText size={48} strokeWidth={1} className="text-slate-300 mb-4" />
                  <p>Upload a document to view preview</p>
                </div>
              ) : (
                <div className="flex flex-col space-y-4">
                  <div className="p-4 bg-blue-50 border border-blue-100 rounded-lg text-sm text-blue-800 flex items-start gap-3">
                    <CheckCircle className="shrink-0 mt-0.5 text-blue-500" size={18} />
                    <p>Draw a box over the target text (like an Invoice ID) and click Extract. The app will scan this exact spot on every page.</p>
                  </div>

                  <div className="border border-slate-300 rounded-md bg-slate-100 overflow-auto flex justify-center p-2 shadow-inner">
                    <ReactCrop crop={crop} onChange={c => setCrop(c)}>
                      <img 
                        ref={imageRef} 
                        src={previewImage} 
                        alt="PDF Preview" 
                        className="max-w-full shadow-sm"
                      />
                    </ReactCrop>
                  </div>
                  
                  
                  <div className="flex justify-end pt-2">
                    <button 
                      onClick={performOCR} 
                      disabled={!crop || isProcessing}
                      className={`px-5 py-2.5 rounded-lg font-medium flex items-center gap-2 transition-colors
                        ${!crop || isProcessing 
                          ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                          : 'bg-slate-800 hover:bg-slate-900 text-white shadow-sm'
                        }`}
                    >
                      {isProcessing ? (
                        <><Loader2 size={16} className="animate-spin" /> Reading Image...</>
                      ) : (
                        <><ScanText size={16} /> Extract Text for Filename</>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
  );
}

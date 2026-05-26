import {
  Settings,
  Loader2,
  Download,
} from 'lucide-react';

export default function SettingsPanel({
  extractedText,
  prefixFilter,
  setPrefixFilter,
  splitMode,
  setSplitMode,
  splitCondition,
  setSplitCondition,
  isProcessing,
  progress,
  splitAndDownload,
}) {

  return (
    
                
                  <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 animate-in fade-in duration-300">
                    <h2 className="text-sm font-semibold text-indigo-600 uppercase tracking-wider mb-4 flex items-center gap-2">
                      <Settings size={16} /> 3. Configure & Process
                    </h2>
                    
                    <div className="bg-slate-50 p-3 rounded-md border border-slate-200 mb-5">
                      <span className="text-xs text-slate-500 uppercase tracking-wide block mb-1">Sample Extracted Text:</span>
                      <span className="font-mono text-indigo-700 font-bold break-all">{extractedText}</span>
                    </div>
                    
                    <div className="space-y-5">
                      {/* Prefix Input */}
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Prefix Search (Optional)</label>
                        <input 
                          type="text" 
                          placeholder="e.g., RWB-DO"
                          value={prefixFilter} 
                          onChange={e => setPrefixFilter(e.target.value)} 
                          className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        <p className="text-xs text-slate-500 mt-1">App searches the crop area for this exact starting text.</p>
                      </div>
    
                      {/* Split Method Toggles */}
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Split Method</label>
                        <div className="grid grid-cols-2 gap-3">
                          <label className={`flex flex-col items-center justify-center p-3 border rounded-md cursor-pointer transition-all ${splitMode === 'smart' ? 'bg-indigo-50 border-indigo-500 ring-1 ring-indigo-500' : 'bg-white hover:bg-slate-50'}`}>
                            <input type="radio" value="smart" className="sr-only" checked={splitMode === 'smart'} onChange={() => setSplitMode('smart')} />
                            <span className="text-sm font-bold text-slate-700">Smart Split</span>
                            <span className="text-xs text-slate-500 text-center mt-1">Detect New ID</span>
                          </label>
                          <label className={`flex flex-col items-center justify-center p-3 border rounded-md cursor-pointer transition-all ${splitMode === 'fixed' ? 'bg-indigo-50 border-indigo-500 ring-1 ring-indigo-500' : 'bg-white hover:bg-slate-50'}`}>
                            <input type="radio" value="fixed" className="sr-only" checked={splitMode === 'fixed'} onChange={() => setSplitMode('fixed')} />
                            <span className="text-sm font-bold text-slate-700">Fixed</span>
                            <span className="text-xs text-slate-500 text-center mt-1">Every X Pages</span>
                          </label>
                        </div>
                      </div>
    
                      {/* Conditional Number Input for Fixed Mode */}
                      {splitMode === 'fixed' && (
                        <div className="animate-in slide-in-from-top-2">
                          <label className="flex items-center text-sm font-medium text-slate-700">
                            Pages per split:
                            <input 
                              type="number" 
                              value={splitCondition} 
                              onChange={e => setSplitCondition(Number(e.target.value))} 
                              min="1"
                              className="ml-3 w-20 px-2 py-1 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                          </label>
                        </div>
                      )}
                      
                      {/* Progress Bar & Submit Button */}
                      <div className="pt-2">
                        {isProcessing ? (
                          <div className="w-full">
                            <div className="flex justify-between text-xs font-medium text-indigo-700 mb-1">
                              <span className="flex items-center gap-2"><Loader2 size={12} className="animate-spin"/> Processing...</span>
                              <span>{progress}%</span>
                            </div>
                            <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
                              <div className="bg-indigo-600 h-2.5 rounded-full transition-all duration-300 ease-out" style={{ width: `${progress}%` }}></div>
                            </div>
                          </div>
                        ) : (
                          <button 
                            onClick={splitAndDownload} 
                            disabled={isProcessing}
                            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg shadow-sm flex items-center justify-center gap-2 transition-colors focus:ring-4 focus:ring-indigo-100"
                          >
                            <Download size={20} /> Split & Download ZIP
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                
  );
}
import React, { useState, useRef } from 'react'; 
import pdfjsLib from './services/pdfService';
import 'react-image-crop/dist/ReactCrop.css';
import ErrorBanner from './components/ErrorBanner';
import UploadCard from './components/UploadCard';
import PreviewPanel from './components/PreviewPanel';
import SettingsPanel from './components/SettingsPanel';
import useOcr from './hooks/useOcr';
import usePdfProcessor from './hooks/usePdfProcessor';
import useProgress from './hooks/useProgress';
import { MAX_FILE_MB, PDF_PREVIEW_SCALE } from './config/appConfig';
import {
  APP_NAME
} from './config/appConfig';
import { SpeedInsights } from "@vercel/speed-insights/react"


// UI UPGRADE: Imported professional icons from lucide-react
import { Scissors } from 'lucide-react';


export default function PdfSplitterApp() {

  const [pdfBytes, setPdfBytes] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [crop, setCrop] = useState();
  const [extractedText, setExtractedText] = useState('');
  const [splitCondition, setSplitCondition] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [splitMode, setSplitMode] = useState('smart');
  const [prefixFilter, setPrefixFilter] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showUpgradeButton, setShowUpgradeButton] = useState(false);

  // UI UPGRADE: Added a progress state to show the user a visual loading bar during large splits
 const {
  progress,
  setProgress,
  resetProgress,
  completeProgress,
} = useProgress();
  
  
  const imageRef = useRef(null);

  // 1. Handle File Upload (Logic remains exactly the same)
  const handleFileUpload = async (e) => {
    setErrorMessage(''); 
    setShowUpgradeButton(false);
    setExtractedText('');
    setCrop(undefined);
    resetProgress();

    const file = e.target.files[0];
    if (file.type !== 'application/pdf') {
        setErrorMessage(
        'Only PDF files are allowed.'
    );

    return;
  }

if (
  file.size >
  MAX_FILE_MB * 1024 * 1024
) {

  setPdfBytes(null);

  setPreviewImage(null);

  setExtractedText('');

  setCrop(undefined);

  setErrorMessage(
    `File size exceeds ${MAX_FILE_MB}MB limit.`
  );

  return;
}

    try {
      const arrayBuffer = await file.arrayBuffer();
      setPdfBytes(arrayBuffer);

      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer.slice(0) }).promise;
      
      const page = await pdf.getPage(1);
      const viewport = page.getViewport({ scale: PDF_PREVIEW_SCALE});
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      canvas.height = viewport.height;
      canvas.width = viewport.width;

      await page.render({ canvasContext: context, viewport: viewport }).promise;
      setPreviewImage(canvas.toDataURL('image/jpeg'));
    } catch (error) {
      console.error("PDF Load Error:", error);
      setErrorMessage(`Failed to load PDF: ${error.message}`);
    }
  };

// 2. Perform OCR on the cropped area (Logic remains the same, but now it's in a custom hook for better separation of concerns)
const { performOCR } = 
  useOcr({
    crop,
    imageRef,
    setIsProcessing,
    setExtractedText,
    setErrorMessage,
});

// 3. Split PDF and Download ZIP
const { splitAndDownload } =
  usePdfProcessor({
    pdfBytes,
    crop,
    imageRef,
    splitMode,
    splitCondition,
    prefixFilter,
    setIsProcessing,
    setProgress,
    completeProgress,
    setErrorMessage,
    setShowUpgradeButton,
});

  // UI UPGRADE: Completely rebuilt the render block using Tailwind CSS classes.
  // Replaced inline styles with modern utility classes for spacing, colors, borders, and shadows.
  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8 font-sans text-slate-800">
      <div className="max-w-6xl mx-auto">
        
        {/* UI UPGRADE: Enhanced Header with Icon */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-2 flex items-center justify-center gap-3">
            <Scissors className="text-indigo-600" size={36} />
            {APP_NAME}
          </h1>
          <p className="text-lg text-slate-800">Intelligent document routing and OCR extraction</p>
        </div>

        {/* Error Banner */}
        <ErrorBanner
          errorMessage={errorMessage}
          showUpgradeButton={showUpgradeButton}
        />

        {/* UI UPGRADE: Created a two-column grid layout for desktop screens */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT COLUMN: Controls & Settings (Takes up 5 columns out of 12) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Step 1: Upload Card */}
            <UploadCard
              handleFileUpload={handleFileUpload}
              isProcessing={isProcessing}
            />

            {/* Step 3: Settings Card (Only shows after text is extracted, just like your original logic) */}
            {extractedText && (
              <SettingsPanel
                extractedText={extractedText}
                prefixFilter={prefixFilter}
                setPrefixFilter={setPrefixFilter}
                splitMode={splitMode}
                setSplitMode={setSplitMode}
                splitCondition={splitCondition}
                setSplitCondition={setSplitCondition}
                isProcessing={isProcessing}
                progress={progress}
                splitAndDownload={splitAndDownload}
              />
            )}

          </div>

          {/* RIGHT COLUMN: Preview & Cropping Area (Takes up 7 columns out of 12) */}
          <PreviewPanel
            previewImage={previewImage}
            crop={crop}
            setCrop={setCrop}
            performOCR={performOCR}
            isProcessing={isProcessing}
            imageRef={imageRef}
          />

        </div>
      </div>
      <SpeedInsights />
    </div>
  );
}

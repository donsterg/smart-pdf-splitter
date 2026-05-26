import { useCallback } from 'react';

import {
  OCR_LANGUAGE,
} from '../config/appConfig';

import { recognizeText } from '../services/ocrService';

export default function useOcr({
  crop,
  imageRef,
  setIsProcessing,
  setExtractedText,
  setErrorMessage,
}) {

  const performOCR = useCallback(async () => {

    if (!imageRef.current || !crop) return;

    try {

      setIsProcessing(true);

      const canvas =
        document.createElement('canvas');

      const scaleX =
        imageRef.current.naturalWidth /
        imageRef.current.width;

      const scaleY =
        imageRef.current.naturalHeight /
        imageRef.current.height;

      canvas.width = crop.width;
      canvas.height = crop.height;

      const ctx = canvas.getContext('2d');

      ctx.drawImage(
        imageRef.current,
        crop.x * scaleX,
        crop.y * scaleY,
        crop.width * scaleX,
        crop.height * scaleY,
        0,
        0,
        crop.width,
        crop.height
      );

      const croppedImageUrl =
        canvas.toDataURL('image/jpeg');

      const text =
        await recognizeText(
          croppedImageUrl,
          OCR_LANGUAGE
        );

      const cleanFileName =
        text
          .replace(/[^a-zA-Z0-9 ]/g, '')
          .trim();

      setExtractedText(
        cleanFileName || 'Document'
      );

    } catch (error) {

      console.error(error);

      setErrorMessage(
        'OCR extraction failed.'
      );

    } finally {

      setIsProcessing(false);
    }

  }, [
    crop,
    imageRef,
    setIsProcessing,
    setExtractedText,
    setErrorMessage,
  ]);

  return {
    performOCR,
  };
}
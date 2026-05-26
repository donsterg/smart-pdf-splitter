import { useCallback } from 'react';

import { PDFDocument } from 'pdf-lib';

import pdfjsLib from '../services/pdfService';

import { recognizeText }
  from '../services/ocrService';

import {
  createZip,
  addPdfToZip,
  generateZipBlob,
  downloadZip,
} from '../services/zipService';

import {
  FREE_PAGE_LIMIT,
  PDF_RENDER_SCALE,
  OCR_LANGUAGE,
} from '../config/appConfig';

export default function usePdfProcessor({
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
}) {

  const finalizeSubDocument =
    async (
      zip,
      originalPdf,
      pageIndices,
      fileName
    ) => {

      const newPdf =
        await PDFDocument.create();

      const copiedPages =
        await newPdf.copyPages(
          originalPdf,
          pageIndices
        );

      copiedPages.forEach(page =>
        newPdf.addPage(page)
      );

      const pdfBytes =
        await newPdf.save();

      addPdfToZip(
        zip,
        fileName,
        pdfBytes
      );
  };

  const splitAndDownload =
    useCallback(async () => {

      // --- MONETIZATION CHECK ---
      const isProUser = false;

      if (
        !pdfBytes ||
        !crop ||
        !imageRef.current
      ) {

        setErrorMessage(
          'Please select a text area and prefix first.'
        );

        return;
      }

      try {

        // Pre-check PDF page count
        const tempPdf =
          await PDFDocument.load(
            pdfBytes.slice(0)
          );

        const totalPages =
          tempPdf.getPageCount();

        if (
          totalPages > FREE_PAGE_LIMIT &&
          !isProUser
        ) {

          setErrorMessage(
            `Free version is limited to ${FREE_PAGE_LIMIT} pages. Your file has ${totalPages} pages.`
          );

          setShowUpgradeButton(true);

          return;
        }

        setIsProcessing(true);

        setProgress(0);

        const originalPdf =
          await PDFDocument.load(
            pdfBytes.slice(0)
          );

        const pdfDocForOcr =
          await pdfjsLib
            .getDocument({
              data: pdfBytes.slice(0),
            })
            .promise;

        const zip = createZip();

        const scaleX =
          imageRef.current.naturalWidth /
          imageRef.current.width;

        const scaleY =
          imageRef.current.naturalHeight /
          imageRef.current.height;

        let currentFilePages = [];

        let currentFileName = '';

        for (
          let i = 0;
          i < totalPages;
          i++
        ) {

          // Progress update
          setProgress(
            Math.round(
              ((i + 1) / totalPages) * 100
            )
          );

          const page =
            await pdfDocForOcr.getPage(i + 1);

          const viewport =
            page.getViewport({
              scale: PDF_RENDER_SCALE,
            });

          const canvas =
            document.createElement('canvas');

          const ctx =
            canvas.getContext('2d');

          canvas.height =
            viewport.height;

          canvas.width =
            viewport.width;

          await page.render({
            canvasContext: ctx,
            viewport: viewport,
          }).promise;

          const cropCanvas =
            document.createElement('canvas');

          cropCanvas.width =
            crop.width *
            (
              viewport.width /
              imageRef.current.naturalWidth
            ) *
            scaleX;

          cropCanvas.height =
            crop.height *
            (
              viewport.height /
              imageRef.current.naturalHeight
            ) *
            scaleY;

          const cropCtx =
            cropCanvas.getContext('2d');

          cropCtx.drawImage(
            canvas,

            crop.x *
            (
              viewport.width /
              imageRef.current.width
            ),

            crop.y *
            (
              viewport.height /
              imageRef.current.height
            ),

            crop.width *
            (
              viewport.width /
              imageRef.current.width
            ),

            crop.height *
            (
              viewport.height /
              imageRef.current.height
            ),

            0,
            0,

            cropCanvas.width,
            cropCanvas.height
          );

          const text =
            await recognizeText(
              cropCanvas.toDataURL(
                'image/jpeg'
              ),
              OCR_LANGUAGE
            );

          let detectedID = null;

          if (prefixFilter) {

            const regex =
              new RegExp(
                `${prefixFilter}\\S*`,
                'i'
              );

            const match =
              text.match(regex);

            if (match) {

              detectedID =
                match[0]
                  .replace(
                    /[^a-zA-Z0-9-]/g,
                    ''
                  );
            }
          }

          // SMART SPLIT MODE
          if (splitMode === 'smart') {

            if (
              detectedID &&
              detectedID !== currentFileName
            ) {

              if (
                currentFilePages.length > 0
              ) {

                await finalizeSubDocument(
                  zip,
                  originalPdf,
                  currentFilePages,
                  currentFileName ||
                  `Unknown_${i}`
                );
              }

              currentFileName =
                detectedID;

              currentFilePages = [i];

            } else {

              currentFilePages.push(i);
            }

          } else {

            // FIXED SPLIT MODE
            currentFilePages.push(i);

            if (
              currentFilePages.length === splitCondition ||
              i === totalPages - 1
            ) {

              const name =
                detectedID ||
                `Part_${Math.floor(
                  i / splitCondition
                ) + 1}`;

              await finalizeSubDocument(
                zip,
                originalPdf,
                currentFilePages,
                name
              );

              currentFilePages = [];
            }
          }
        }

        // Final smart split save
        if (
          splitMode === 'smart' &&
          currentFilePages.length > 0
        ) {

          await finalizeSubDocument(
            zip,
            originalPdf,
            currentFilePages,
            currentFileName ||
            'Last_Document'
          );
        }

        const zipBlob =
          await generateZipBlob(zip);

        downloadZip(zipBlob);
        completeProgress();

      } catch (error) {

        console.error(error);

        setErrorMessage(
          `Processing failed: ${error.message}`
        );

      } finally {

        setIsProcessing(false);
      }

    }, [
      pdfBytes,
      crop,
      imageRef,
      splitMode,
      splitCondition,
      prefixFilter,
      setIsProcessing,
      setProgress,
      setErrorMessage,
      setShowUpgradeButton,
    ]);

  return {
    splitAndDownload,
  };
}
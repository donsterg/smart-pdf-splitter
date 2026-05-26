import JSZip from 'jszip';
import { saveAs } from 'file-saver';

export const createZip = () => {
  return new JSZip();
};

export const addPdfToZip = (
  zip,
  fileName,
  pdfBytes
) => {

  zip.file(`${fileName}.pdf`, pdfBytes);
};
export const generateZipBlob = async (zip) => {

  return await zip.generateAsync({
    type: 'blob',
  });
};

export const downloadZip = (
  zipBlob,
  filename = 'Smart_Split_Docs.zip'
) => {

  saveAs(zipBlob, filename);
};
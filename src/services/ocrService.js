import Tesseract from 'tesseract.js';

export const recognizeText = async (
  image,
  language = 'eng'
) => {

  const {
    data: { text },
  } = await Tesseract.recognize(image, language);

  return text;
};
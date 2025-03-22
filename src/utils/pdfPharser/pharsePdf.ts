import * as pdfjsLib from 'pdfjs-dist';

// Function to extract text from PDF using pdfjs-dist
export const extractTextFromPDF = async (
  pdfBuffer: Buffer
): Promise<string> => {
  // Convert the Buffer to Uint8Array
  const uint8Array = new Uint8Array(pdfBuffer);

  const loadingTask = pdfjsLib.getDocument({ data: uint8Array });
  const pdfDoc = await loadingTask.promise;
  let textContent = '';

  for (let i = 0; i < pdfDoc.numPages; i++) {
    const page = await pdfDoc.getPage(i + 1);
    const text = await page.getTextContent();
    const pageText = text.items.map((item: any) => item.str).join(' ');
    textContent += pageText;
  }

  return textContent;
};

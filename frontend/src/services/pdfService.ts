import * as pdfjsLib from 'pdfjs-dist/build/pdf';
import workerUrl from 'pdfjs-dist/build/pdf.worker.js?url';

// Set the worker source
pdfjsLib.GlobalWorkerOptions.workerSrc = workerUrl;

/**
 * Extract text content from a PDF file
 * @param {File} file - The PDF file to extract text from
 * @returns {Promise<string>} - The extracted text content
 */
export async function extractTextFromPDF(file: File): Promise<string> {
  try {
    const fileData = await readFileData(file);
    const loadingTask = pdfjsLib.getDocument({ data: fileData });
    const pdf = await loadingTask.promise;

    console.log(`PDF loaded successfully. Total pages: ${pdf.numPages}`);
    
    let fullText = '';
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items.map(item => 'str' in item ? item.str : '').join(' ');
      fullText += `\n--- Page ${i} ---\n${pageText}\n`;
    }

    return fullText.trim();
  } catch (error) {
    console.error('Error extracting text from PDF:', error);
    throw new Error('Failed to extract text from PDF');
  }
}

/**
 * Read file data as Uint8Array
 * @param {File} file - The file to read
 * @returns {Promise<Uint8Array>} - The file data
 */
function readFileData(file: File): Promise<Uint8Array> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        resolve(new Uint8Array(event.target.result as ArrayBuffer));
      } else {
        reject(new Error('Failed to read file data'));
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsArrayBuffer(file);
  });
}

/**
 * Get metadata from PDF
 * @param {File} file - The PDF file
 * @returns {Promise<Object>} - The PDF metadata
 */
export async function getPDFMetadata(file: File): Promise<any> {
  try {
    const fileData = await readFileData(file);
    const loadingTask = pdfjsLib.getDocument({ data: fileData });
    const pdf = await loadingTask.promise;
    
    const metadata = await pdf.getMetadata();
    return {
      ...metadata,
      pageCount: pdf.numPages,
      fileName: file.name,
      fileSize: file.size,
    };
  } catch (error) {
    console.error('Error getting PDF metadata:', error);
    throw new Error('Failed to get PDF metadata');
  }
} 
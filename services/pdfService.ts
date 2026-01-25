import * as pdfjsLib from 'pdfjs-dist';

// Set up the worker for PDF.js - using local worker file
pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';

/**
 * PDF Service - Extracts text from PDF files using PDF.js
 */

export const extractTextFromPDF = async (file: File): Promise<string> => {
    console.log('📄 ===== PDF TEXT EXTRACTION START =====');
    console.log('📄 File name:', file.name);
    console.log('📄 File size:', (file.size / 1024).toFixed(2), 'KB');
    console.log('📄 File type:', file.type);

    try {
        console.log('📄 Using PDF.js library for extraction');

        // Convert file to ArrayBuffer
        const arrayBuffer = await file.arrayBuffer();
        console.log('📄 File loaded into ArrayBuffer');

        // Load the PDF document
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        console.log('📄 PDF loaded successfully -', pdf.numPages, 'pages');

        let fullText = '';

        // Extract text from each page
        for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
            console.log(`📄 Extracting text from page ${pageNum}/${pdf.numPages}...`);
            const page = await pdf.getPage(pageNum);
            const textContent = await page.getTextContent();
            const pageText = textContent.items
                .map((item: any) => item.str)
                .join(' ');
            fullText += pageText + '\n\n';
        }

        const trimmedText = fullText.trim();
        console.log('📄 Total text extracted:', trimmedText.length, 'characters');
        console.log('📄 First 300 chars:', trimmedText.substring(0, 300));

        if (trimmedText.length < 50) {
            console.error('❌ Insufficient text extracted (< 50 chars)');
            throw new Error('Could not extract sufficient text from PDF. The file may be image-based or encrypted.');
        }

        console.log('✅ Text extraction successful!');
        console.log('📄 ===== PDF TEXT EXTRACTION END =====');
        return trimmedText;

    } catch (error) {
        console.error('❌ ===== PDF TEXT EXTRACTION FAILED =====');
        console.error('❌ Error:', error);
        console.error('❌ Error message:', error instanceof Error ? error.message : String(error));
        throw new Error('Failed to extract text from PDF. Please ensure the file is a valid PDF with selectable text.');
    }
};

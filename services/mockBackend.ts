import { PortfolioContent, ResumeStatus } from '../types';
import { extractTextFromPDF } from './pdfService';
import { analyzeResume } from './geminiService';

// This service handles resume upload and processing with Gemini AI

const MOCK_DELAY = 1000; // Small delay for UX feedback

export const mockUploadResume = async (file: File): Promise<string> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(`resumes/${Date.now()}_${file.name}`);
    }, 500);
  });
};

export const mockProcessResume = async (
  _resumeId: string,
  file: File,
  onStatusUpdate: (status: ResumeStatus) => void
): Promise<PortfolioContent> => {

  console.log('🚀 ===== RESUME PROCESSING START =====');
  console.log('🚀 File:', file.name, `(${(file.size / 1024).toFixed(2)} KB)`);

  try {
    // Step 1: Extracting text from PDF
    console.log('');
    console.log('📝 STEP 1: Extracting text from PDF');
    onStatusUpdate(ResumeStatus.EXTRACTING);
    await new Promise(r => setTimeout(r, MOCK_DELAY));

    const resumeText = await extractTextFromPDF(file);
    console.log('✅ Step 1 complete - Text extracted:', resumeText.length, 'characters');

    // Step 2: Analyzing with Gemini AI
    console.log('');
    console.log('🤖 STEP 2: Analyzing with Gemini AI');
    onStatusUpdate(ResumeStatus.ANALYZING);
    await new Promise(r => setTimeout(r, MOCK_DELAY));

    const portfolioContent = await analyzeResume(resumeText);
    console.log('✅ Step 2 complete - Portfolio generated');

    // Step 3: Generating portfolio (this is instant now, but we show status for UX)
    console.log('');
    console.log('🎨 STEP 3: Finalizing portfolio');
    onStatusUpdate(ResumeStatus.GENERATING);
    await new Promise(r => setTimeout(r, MOCK_DELAY));

    onStatusUpdate(ResumeStatus.COMPLETED);
    console.log('');
    console.log('✅ ===== RESUME PROCESSING COMPLETE =====');
    console.log('✅ Generated portfolio for:', portfolioContent.hero.headline);

    return portfolioContent;
  } catch (error) {
    console.error('');
    console.error('❌ ===== RESUME PROCESSING FAILED =====');
    console.error('❌ Error type:', error instanceof Error ? error.constructor.name : typeof error);
    console.error('❌ Error message:', error instanceof Error ? error.message : String(error));
    if (error instanceof Error && error.stack) {
      console.error('❌ Stack trace:');
      console.error(error.stack);
    }
    console.error('❌ Full error object:', error);
    console.error('❌ =====================================');

    onStatusUpdate(ResumeStatus.COMPLETED);

    // Return fallback data if AI fails
    console.log('⚠️ Returning fallback portfolio data');
    return {
      hero: {
        headline: "Professional Resume Portfolio",
        subheadline: "We encountered an issue analyzing your resume. Please try again or contact support.",
        ctaText: "Try Again"
      },
      about: {
        summary: "There was an error processing your resume with AI. Please ensure your PDF contains readable text and try uploading again.",
        skills: []
      },
      experience: [],
      projects: [],
      contact: {
        email: "",
        linkedin: "",
        github: ""
      }
    };
  }
};

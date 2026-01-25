import { PortfolioContent } from '../types';

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

if (!apiKey) {
  throw new Error('Missing Gemini API key. Please check your .env file.');
}

// Using direct REST API with v1beta endpoint and models/ prefix
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

export const analyzeResume = async (resumeText: string): Promise<PortfolioContent> => {
  console.log('🤖 ===== GEMINI AI ANALYSIS START =====');
  console.log('🤖 Resume text length:', resumeText.length, 'characters');
  console.log('🤖 First 300 chars:', resumeText.substring(0, 300));

  const prompt = `
You are a SENIOR PORTFOLIO DESIGN EXPERT with 15+ years of experience crafting compelling professional portfolios for executives, tech leads, and industry professionals. Your expertise lies in:
- Transforming dry resume content into captivating narratives
- Highlighting quantified achievements and measurable impact
- Creating attention-grabbing headlines that make people want to learn more
- Extracting the "story" behind each career move and accomplishment
- Writing in an engaging, confident tone that showcases expertise without arrogance

CRITICAL INSTRUCTIONS:
1. **Headlines must be COMPELLING** - Not just job titles. Create headlines that showcase their unique value proposition and expertise.
2. **Quantify everything possible** - Extract numbers, percentages, growth metrics, team sizes, project scales.
3. **Tell a story** - Connect experiences to show career progression and expertise building.
4. **Professional but engaging** - Use active voice, action verbs, and avoid corporate jargon.
5. **Highlight impact** - Focus on "what they accomplished" not just "what they did."

Resume Text:
${resumeText}

Generate a JSON response with this EXACT structure:
{
  "hero": {
    "headline": "A compelling, attention-grabbing headline (40-70 chars) that captures their expertise and unique value. Examples: 'Building Scalable Solutions That Drive 10x Growth' or 'Product Leader Shipping Features Used by Millions' - NOT just 'Software Engineer' or 'Product Manager'",
    "subheadline": "An engaging 1-2 sentence summary (100-160 chars) that tells their professional story and highlights key achievements or expertise areas",
    "ctaText": "Action-oriented CTA like 'See My Work', 'Let's Connect', 'View Projects', 'Get In Touch'"
  },
  "about": {
    "summary": "A compelling 2-3 paragraph professional narrative (200-300 words) that:
    - Opens with their current role and expertise
    - Highlights key achievements with QUANTIFIED results (revenue growth, users impacted, efficiency gains)
    - Tells the story of their career journey and what drives them
    - Concludes with their current focus/what they're passionate about
    Use active voice, be specific, make it engaging to read.",
    "skills": ["Extract ALL relevant skills - technical, tools, methodologies, soft skills - from the resume. Include 10-20 skills."]
  },
  "experience": [
    {
      "company": "Company Name",
      "role": "Actual Job Title",
      "duration": "Month Year - Month Year (or Present)",
      "description": "A compelling 2-4 sentence description that:
      - Starts with the scope/context (team size, budget, user base)
      - Highlights 2-3 KEY achievements with quantified impact
      - Uses action verbs and active voice
      - Example: 'Led a cross-functional team of 12 engineers building features for 2M+ users. Shipped 3 major product releases that increased user engagement by 45% and reduced churn by 30%. Established agile practices that improved delivery speed by 2x.'"
    }
  ],
  "projects": [
    {
      "title": "Compelling Project Name",
      "description": "Brief but impactful description (50-100 words) highlighting the problem solved, approach taken, and results achieved. Include metrics if available.",
      "technologies": ["tech1", "tech2", "tech3"],
      "link": "project-url-if-mentioned-otherwise-#"
    }
  ],
  "contact": {
    "email": "exact-email-from-resume",
    "linkedin": "linkedin.com/in/username-if-present-otherwise-empty",
    "github": "github.com/username-if-present-otherwise-empty"
  }
}

CRITICAL RULES:
- Return ONLY valid JSON, no markdown, no code blocks, no explanatory text
- Extract ACTUAL information from the resume - don't make up companies or roles
- If projects aren't explicitly mentioned, infer them from described work accomplishments
- Make every word count - this is their professional brand
- Headlines should make someone say "tell me more!" not "okay, another [job title]"
`;

  try {
    console.log('🤖 Sending request to Gemini API (v1 endpoint)...');

    const response = await fetch(GEMINI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }]
      })
    });

    console.log('🤖 Response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ API Error:', errorText);
      throw new Error(`Gemini API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log('🤖 Received response from Gemini API');

    // Extract text from Gemini response
    const generatedText = data.candidates[0].content.parts[0].text;
    console.log('🤖 Generated text length:', generatedText.length);
    console.log('🤖 First 500 chars:', generatedText.substring(0, 500));

    // Clean up JSON from response
    let jsonText = generatedText.trim();

    // Remove markdown code blocks if present
    if (jsonText.startsWith('```json')) {
      console.log('🤖 Removing ```json markdown wrapper');
      jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    } else if (jsonText.startsWith('```')) {
      console.log('🤖 Removing ``` markdown wrapper');
      jsonText = jsonText.replace(/```\n?/g, '');
    }

    console.log('🤖 Cleaned JSON length:', jsonText.length);
    console.log('🤖 About to parse JSON...');

    // Parse the JSON
    const portfolioData: PortfolioContent = JSON.parse(jsonText);

    console.log('✅ Successfully parsed portfolio data!');
    console.log('✅ Hero headline:', portfolioData.hero.headline);
    console.log('✅ Skills count:', portfolioData.about.skills.length);
    console.log('✅ Experience entries:', portfolioData.experience.length);
    console.log('✅ Projects:', portfolioData.projects.length);
    console.log('🤖 ===== GEMINI AI ANALYSIS END =====');

    return portfolioData;
  } catch (error) {
    console.error('❌ ===== GEMINI AI ANALYSIS FAILED =====');
    console.error('❌ Error type:', error instanceof Error ? error.constructor.name : typeof error);
    console.error('❌ Error message:', error instanceof Error ? error.message : String(error));
    if (error instanceof Error && error.stack) {
      console.error('❌ Stack trace:', error.stack);
    }
    console.error('❌ Full error:', error);
    throw new Error('Failed to analyze resume. Please try again.');
  }
};

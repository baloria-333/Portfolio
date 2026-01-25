import { PortfolioContent, ResumeStatus } from '../types';

// This service simulates what would happen in a Server Action or Edge Function
// Since we cannot securely put Gemini Keys in client-side code.

const MOCK_DELAY = 2000;

export const mockUploadResume = async (file: File): Promise<string> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(`resumes/${Date.now()}_${file.name}`);
    }, 1000);
  });
};

export const mockProcessResume = async (
  resumeId: string, 
  onStatusUpdate: (status: ResumeStatus) => void
): Promise<PortfolioContent> => {
  
  // Step 1: Extracting
  onStatusUpdate(ResumeStatus.EXTRACTING);
  await new Promise(r => setTimeout(r, MOCK_DELAY));

  // Step 2: Analyzing (Simulating Gemini)
  onStatusUpdate(ResumeStatus.ANALYZING);
  await new Promise(r => setTimeout(r, MOCK_DELAY));

  // Step 3: Generating
  onStatusUpdate(ResumeStatus.GENERATING);
  await new Promise(r => setTimeout(r, MOCK_DELAY));

  onStatusUpdate(ResumeStatus.COMPLETED);
  
  // Return mock generated data strictly adhering to schema
  return {
    hero: {
      headline: "Senior Frontend Engineer specializing in React & UX",
      subheadline: "Building scalable, accessible, and performant web applications with modern technologies.",
      ctaText: "View My Work"
    },
    about: {
      summary: "Passionate developer with 6+ years of experience in the JavaScript ecosystem. Proven track record of leading teams and delivering high-impact projects.",
      skills: ["React", "TypeScript", "Next.js", "Tailwind CSS", "Node.js", "AWS"]
    },
    experience: [
      {
        company: "TechFlow Solutions",
        role: "Senior Frontend Engineer",
        duration: "2021 - Present",
        description: "Led the migration of a legacy monolith to a micro-frontend architecture, improving deployment speed by 40%."
      },
      {
        company: "Creative Digital Agency",
        role: "Web Developer",
        duration: "2018 - 2021",
        description: "Developed award-winning marketing sites for Fortune 500 clients using React and WebGL."
      }
    ],
    projects: [
      {
        title: "E-commerce Dashboard",
        description: "A real-time analytics dashboard for online retailers.",
        technologies: ["React", "D3.js", "Firebase"],
        link: "#"
      },
      {
        title: "SaaS Component Library",
        description: "Internal design system used across 5 distinct products.",
        technologies: ["TypeScript", "Storybook", "Rollup"],
        link: "#"
      }
    ],
    contact: {
      email: "alex.dev@example.com",
      linkedin: "linkedin.com/in/alexdev",
      github: "github.com/alexdev"
    }
  };
};

export interface UserProfile {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
}

export enum ResumeStatus {
  UPLOADED = 'uploaded',
  EXTRACTING = 'extracting',
  ANALYZING = 'analyzing',
  GENERATING = 'generating',
  COMPLETED = 'completed',
  FAILED = 'failed'
}

export interface Resume {
  id: string;
  user_id: string;
  file_path: string;
  status: ResumeStatus;
  created_at: string;
}

export interface PortfolioContent {
  profilePhoto?: string; // Base64 encoded image
  hero: {
    headline: string;
    subheadline: string;
    ctaText: string;
  };
  about: {
    summary: string;
    skills: string[];
  };
  experience: {
    company: string;
    role: string;
    duration: string;
    description: string;
  }[];
  projects: {
    title: string;
    description: string;
    technologies: string[];
    link?: string;
  }[];
  contact: {
    email: string;
    linkedin?: string;
    github?: string;
  };
}

export interface Portfolio {
  id: string;
  resume_id: string;
  user_id: string;
  slug: string;
  content_json: PortfolioContent;
  published: boolean;
}

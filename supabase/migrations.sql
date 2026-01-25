-- Create resumes table
CREATE TABLE IF NOT EXISTS public.resumes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  file_path TEXT NOT NULL,
  extracted_text TEXT,
  status TEXT DEFAULT 'uploaded',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create resume_analysis table
CREATE TABLE IF NOT EXISTS public.resume_analysis (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  resume_id UUID REFERENCES public.resumes(id) ON DELETE CASCADE NOT NULL,
  persona_label TEXT,
  confidence FLOAT,
  analysis_json JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create portfolios table
CREATE TABLE IF NOT EXISTS public.portfolios (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  resume_id UUID REFERENCES public.resumes(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content_json JSONB NOT NULL,
  published BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.resumes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resume_analysis ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolios ENABLE ROW LEVEL SECURITY;

-- Policies for Resumes
CREATE POLICY "Users can insert their own resumes" 
  ON public.resumes FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own resumes" 
  ON public.resumes FOR SELECT 
  USING (auth.uid() = user_id);

-- Policies for Portfolios
CREATE POLICY "Users can view their own portfolios" 
  ON public.portfolios FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Public portfolios are viewable by everyone" 
  ON public.portfolios FOR SELECT 
  USING (published = true);

CREATE POLICY "Users can insert own portfolios" 
  ON public.portfolios FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own portfolios" 
  ON public.portfolios FOR UPDATE 
  USING (auth.uid() = user_id);

-- Storage bucket policy (must create bucket 'resume_files' in dashboard first)
-- This SQL cannot create the bucket itself, but sets policies.
-- Assuming bucket 'resume_files' is Private.
CREATE POLICY "Allow authenticated uploads"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'resume_files' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Allow users to view their own files"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'resume_files' AND auth.uid()::text = (storage.foldername(name))[1]);

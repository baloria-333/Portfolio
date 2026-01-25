-- Supabase Database Schema for ResuFolio
-- Run this in Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Portfolios Table
CREATE TABLE IF NOT EXISTS portfolios (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  profile_photo TEXT, -- Base64 encoded image or URL
  hero JSONB NOT NULL,
  about JSONB NOT NULL,
  experience JSONB NOT NULL,
  projects JSONB NOT NULL,
  contact JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_published BOOLEAN DEFAULT false,
  slug TEXT UNIQUE -- For public portfolio URLs (e.g., 'john-doe')
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_portfolios_user_id ON portfolios(user_id);
CREATE INDEX IF NOT EXISTS idx_portfolios_slug ON portfolios(slug);
CREATE INDEX IF NOT EXISTS idx_portfolios_created_at ON portfolios(created_at DESC);

-- Resume Uploads Table (Optional - for tracking upload history)
CREATE TABLE IF NOT EXISTS resume_uploads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_size INTEGER,
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  portfolio_id UUID REFERENCES portfolios(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_resume_uploads_user_id ON resume_uploads(user_id);

-- Enable Row Level Security (RLS)
ALTER TABLE portfolios ENABLE ROW LEVEL SECURITY;
ALTER TABLE resume_uploads ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Portfolios Table

-- Policy: Users can view their own portfolios
CREATE POLICY "Users can view own portfolios"
  ON portfolios
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Users can insert their own portfolios
CREATE POLICY "Users can insert own portfolios"
  ON portfolios
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own portfolios
CREATE POLICY "Users can update own portfolios"
  ON portfolios
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Policy: Users can delete their own portfolios
CREATE POLICY "Users can delete own portfolios"
  ON portfolios
  FOR DELETE
  USING (auth.uid() = user_id);

-- Policy: Public can view published portfolios (anyone with the slug)
CREATE POLICY "Public can view published portfolios"
  ON portfolios
  FOR SELECT
  USING (is_published = true);

-- RLS Policies for Resume Uploads Table

CREATE POLICY "Users can view own uploads"
  ON resume_uploads
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own uploads"
  ON resume_uploads
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update updated_at on portfolio updates
CREATE TRIGGER update_portfolios_updated_at
  BEFORE UPDATE ON portfolios
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Grant necessary permissions (Supabase usually handles this, but just in case)
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON portfolios TO authenticated;
GRANT ALL ON resume_uploads TO authenticated;
GRANT SELECT ON portfolios TO anon; -- For public portfolios

-- Success message
DO $$
BEGIN
  RAISE NOTICE 'Database schema created successfully!';
  RAISE NOTICE 'Tables: portfolios, resume_uploads';
  RAISE NOTICE 'RLS policies enabled and configured';
END $$;

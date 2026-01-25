import { createClient } from '@supabase/supabase-js';

// NOTE: In a real production app, these would come from import.meta.env
// For this demo context, we are mocking the behavior if keys aren't present
// to prevent the app from crashing immediately on the preview.
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://mock.supabase.co';
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || 'mock-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

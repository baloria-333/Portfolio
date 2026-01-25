import { supabase } from './supabase';
import { PortfolioContent } from '../types';

export interface PortfolioRecord {
    id: string;
    user_id: string;
    title: string;
    profile_photo?: string;
    hero: any;
    about: any;
    experience: any[];
    projects: any[];
    contact: any;
    created_at: string;
    updated_at: string;
    is_published: boolean;
    slug?: string;
}

/**
 * Save a new portfolio to the database
 */
export const savePortfolio = async (
    portfolio: PortfolioContent,
    title: string
): Promise<PortfolioRecord> => {
    console.log('💾 Saving portfolio to database...');

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        throw new Error('Not authenticated. Please sign in to save your portfolio.');
    }

    const { data, error } = await supabase
        .from('portfolios')
        .insert({
            user_id: user.id,
            title,
            profile_photo: portfolio.profilePhoto,
            hero: portfolio.hero,
            about: portfolio.about,
            experience: portfolio.experience,
            projects: portfolio.projects,
            contact: portfolio.contact,
        })
        .select()
        .single();

    if (error) {
        console.error('❌ Failed to save portfolio:', error);
        throw new Error(`Failed to save portfolio: ${error.message}`);
    }

    console.log('✅ Portfolio saved successfully:', data.id);
    return data as PortfolioRecord;
};

/**
 * Update an existing portfolio
 */
export const updatePortfolio = async (
    id: string,
    updates: Partial<PortfolioContent> & { title?: string }
): Promise<PortfolioRecord> => {
    console.log('💾 Updating portfolio:', id);

    const { data, error } = await supabase
        .from('portfolios')
        .update({
            ...updates,
            updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();

    if (error) {
        console.error('❌ Failed to update portfolio:', error);
        throw new Error(`Failed to update portfolio: ${error.message}`);
    }

    console.log('✅ Portfolio updated successfully');
    return data as PortfolioRecord;
};

/**
 * Get all portfolios for the current user
 */
export const getPortfolios = async (): Promise<PortfolioRecord[]> => {
    console.log('📂 Fetching user portfolios...');

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        throw new Error('Not authenticated');
    }

    const { data, error } = await supabase
        .from('portfolios')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });

    if (error) {
        console.error('❌ Failed to fetch portfolios:', error);
        throw new Error(`Failed to fetch portfolios: ${error.message}`);
    }

    console.log(`✅ Fetched ${data.length} portfolios`);
    return data as PortfolioRecord[];
};

/**
 * Get a single portfolio by ID
 */
export const getPortfolioById = async (id: string): Promise<PortfolioRecord> => {
    console.log('📄 Fetching portfolio:', id);

    const { data, error } = await supabase
        .from('portfolios')
        .select('*')
        .eq('id', id)
        .single();

    if (error) {
        console.error('❌ Failed to fetch portfolio:', error);
        throw new Error(`Portfolio not found: ${error.message}`);
    }

    console.log('✅ Portfolio fetched successfully');
    return data as PortfolioRecord;
};

/**
 * Get a published portfolio by slug (public access)
 */
export const getPortfolioBySlug = async (slug: string): Promise<PortfolioRecord> => {
    console.log('🔍 Fetching published portfolio by slug:', slug);

    const { data, error } = await supabase
        .from('portfolios')
        .select('*')
        .eq('slug', slug)
        .eq('is_published', true)
        .single();

    if (error) {
        console.error('❌ Portfolio not found:', error);
        throw new Error('Portfolio not found or not published');
    }

    console.log('✅ Published portfolio fetched');
    return data as PortfolioRecord;
};

/**
 * Delete a portfolio
 */
export const deletePortfolio = async (id: string): Promise<void> => {
    console.log('🗑️ Deleting portfolio:', id);

    const { error } = await supabase
        .from('portfolios')
        .delete()
        .eq('id', id);

    if (error) {
        console.error('❌ Failed to delete portfolio:', error);
        throw new Error(`Failed to delete portfolio: ${error.message}`);
    }

    console.log('✅ Portfolio deleted successfully');
};

/**
 * Publish a portfolio with a unique slug
 */
export const publishPortfolio = async (
    id: string,
    slug: string
): Promise<PortfolioRecord> => {
    console.log('🚀 Publishing portfolio with slug:', slug);

    // Check if slug is already taken
    const { data: existing } = await supabase
        .from('portfolios')
        .select('id')
        .eq('slug', slug)
        .neq('id', id)
        .single();

    if (existing) {
        throw new Error('This slug is already taken. Please choose a different one.');
    }

    const { data, error } = await supabase
        .from('portfolios')
        .update({
            is_published: true,
            slug: slug.toLowerCase().replace(/[^a-z0-9-]/g, '-'),
        })
        .eq('id', id)
        .select()
        .single();

    if (error) {
        console.error('❌ Failed to publish portfolio:', error);
        throw new Error(`Failed to publish portfolio: ${error.message}`);
    }

    console.log('✅ Portfolio published successfully');
    return data as PortfolioRecord;
};

/**
 * Unpublish a portfolio
 */
export const unpublishPortfolio = async (id: string): Promise<PortfolioRecord> => {
    console.log('📦 Unpublishing portfolio:', id);

    const { data, error } = await supabase
        .from('portfolios')
        .update({ is_published: false })
        .eq('id', id)
        .select()
        .single();

    if (error) {
        console.error('❌ Failed to unpublish portfolio:', error);
        throw new Error(`Failed to unpublish portfolio: ${error.message}`);
    }

    console.log('✅ Portfolio unpublished');
    return data as PortfolioRecord;
};

/**
 * Generate a unique slug from title
 */
export const generateSlug = (title: string): string => {
    const baseSlug = title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .substring(0, 50);

    // Add random string to ensure uniqueness
    const randomStr = Math.random().toString(36).substring(2, 6);
    return `${baseSlug}-${randomStr}`;
};

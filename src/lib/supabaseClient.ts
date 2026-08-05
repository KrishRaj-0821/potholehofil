import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * SQL Schema definition for Supabase PostGIS Table:
 *
 * CREATE EXTENSION IF NOT EXISTS postgis;
 *
 * CREATE TABLE IF NOT EXISTS pothole_posts (
 *   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 *   author_name TEXT NOT NULL,
 *   author_handle TEXT NOT NULL,
 *   author_avatar TEXT,
 *   location_name TEXT NOT NULL,
 *   pin TEXT NOT NULL DEFAULT '854330',
 *   lat DOUBLE PRECISION NOT NULL,
 *   lng DOUBLE PRECISION NOT NULL,
 *   location_point GEOMETRY(Point, 4326),
 *   image_url TEXT NOT NULL,
 *   meme_caption TEXT NOT NULL,
 *   meme_subtext TEXT,
 *   severity TEXT NOT NULL,
 *   depth_cm INT NOT NULL,
 *   area_sqm DOUBLE PRECISION NOT NULL,
 *   pothole_count INT NOT NULL,
 *   upvotes INT DEFAULT 1,
 *   downvotes INT DEFAULT 0,
 *   created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
 * );
 *
 * CREATE TABLE IF NOT EXISTS ip_votes (
 *   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 *   post_id UUID REFERENCES pothole_posts(id) ON DELETE CASCADE,
 *   ip_hash TEXT NOT NULL,
 *   vote_type TEXT NOT NULL,
 *   created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
 *   UNIQUE(post_id, ip_hash)
 * );
 */

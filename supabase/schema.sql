-- ======================================================
-- PotholeHofile (Kasba 854330) - Supabase PostGIS Database Schema
-- ======================================================

-- 1. Enable Spatial Extensions
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. Create Pothole Posts Table
CREATE TABLE IF NOT EXISTS public.pothole_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_name TEXT NOT NULL DEFAULT 'Kasba Resident',
  author_handle TEXT NOT NULL DEFAULT '@kasba_reporter',
  author_avatar TEXT DEFAULT 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&h=120&q=80',
  location_name TEXT NOT NULL,
  location_pin TEXT NOT NULL DEFAULT '854330',
  lat DOUBLE PRECISION NOT NULL,
  lng DOUBLE PRECISION NOT NULL,
  location_point GEOMETRY(Point, 4326),
  image_url TEXT NOT NULL,
  meme_caption TEXT NOT NULL,
  meme_subtext TEXT,
  severity TEXT NOT NULL CHECK (severity IN ('CRITICAL', 'HIGH', 'MODERATE', 'LOW')),
  depth_cm INT NOT NULL DEFAULT 15,
  area_sqm DOUBLE PRECISION NOT NULL DEFAULT 0.45,
  pothole_count INT NOT NULL DEFAULT 1,
  upvotes INT DEFAULT 1,
  downvotes INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Create Zero-Login IP Vote Tracking Table (Anti-Fraud)
CREATE TABLE IF NOT EXISTS public.ip_votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID REFERENCES public.pothole_posts(id) ON DELETE CASCADE,
  ip_hash TEXT NOT NULL,
  vote_type TEXT NOT NULL CHECK (vote_type IN ('up', 'down')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(post_id, ip_hash)
);

-- 4. Create Post Comments Table
CREATE TABLE IF NOT EXISTS public.post_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID REFERENCES public.pothole_posts(id) ON DELETE CASCADE,
  author_name TEXT NOT NULL,
  comment_text TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Spatial Indexing & Performance Optimization
CREATE INDEX IF NOT EXISTS idx_pothole_posts_location_point ON public.pothole_posts USING GIST(location_point);
CREATE INDEX IF NOT EXISTS idx_pothole_posts_created_at ON public.pothole_posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ip_votes_lookup ON public.ip_votes(post_id, ip_hash);

-- 6. Trigger to automatically sync lat/lng to PostGIS GEOMETRY Point
CREATE OR REPLACE FUNCTION sync_pothole_location_point()
RETURNS TRIGGER AS $$
BEGIN
  NEW.location_point := ST_SetSRID(ST_MakePoint(NEW.lng, NEW.lat), 4326);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_sync_pothole_location ON public.pothole_posts;
CREATE TRIGGER trg_sync_pothole_location
  BEFORE INSERT OR UPDATE OF lat, lng ON public.pothole_posts
  FOR EACH ROW
  EXECUTE FUNCTION sync_pothole_location_point();

-- 7. Enable Row Level Security (RLS)
ALTER TABLE public.pothole_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ip_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_comments ENABLE ROW LEVEL SECURITY;

-- 8. Allow Public Read & Insert Access (Zero-Login Platform)
CREATE POLICY "Allow public read access on pothole_posts"
  ON public.pothole_posts FOR SELECT USING (true);

CREATE POLICY "Allow public insert access on pothole_posts"
  ON public.pothole_posts FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public update upvotes on pothole_posts"
  ON public.pothole_posts FOR UPDATE USING (true);

CREATE POLICY "Allow public read/insert on ip_votes"
  ON public.ip_votes FOR ALL USING (true);

CREATE POLICY "Allow public read/insert on post_comments"
  ON public.post_comments FOR ALL USING (true);

-- Create Dramas Table
CREATE TABLE public.dramas (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    title text NOT NULL,
    slug text UNIQUE NOT NULL,
    description text,
    poster_url text,
    status text,
    genres text[],
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create Episodes Table
CREATE TABLE public.episodes (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    drama_id uuid REFERENCES public.dramas(id) ON DELETE CASCADE,
    episode_number integer NOT NULL,
    terabox_url text NOT NULL,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create Requests Table
CREATE TABLE public.requests (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    drama_title text NOT NULL,
    language_requested text NOT NULL,
    upvotes integer DEFAULT 0,
    status text DEFAULT 'Pending'::text,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Row Level Security (RLS) configuration

-- Dramas
ALTER TABLE public.dramas ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Dramas are viewable by everyone." ON public.dramas FOR SELECT USING (true);
CREATE POLICY "Dramas are insertable by authenticated users only." ON public.dramas FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Dramas are updatable by authenticated users only." ON public.dramas FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Dramas are deletable by authenticated users only." ON public.dramas FOR DELETE USING (auth.role() = 'authenticated');

-- Episodes
ALTER TABLE public.episodes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Episodes are viewable by everyone." ON public.episodes FOR SELECT USING (true);
CREATE POLICY "Episodes are insertable by authenticated users only." ON public.episodes FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Episodes are updatable by authenticated users only." ON public.episodes FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Episodes are deletable by authenticated users only." ON public.episodes FOR DELETE USING (auth.role() = 'authenticated');

-- Requests
ALTER TABLE public.requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Requests are viewable by everyone." ON public.requests FOR SELECT USING (true);
CREATE POLICY "Requests can be created by everyone." ON public.requests FOR INSERT WITH CHECK (true);
CREATE POLICY "Requests can be updated by everyone." ON public.requests FOR UPDATE USING (true);

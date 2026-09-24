-- Create storage buckets for media
INSERT INTO storage.buckets (id, name, public) 
VALUES 
  ('listening-audio', 'listening-audio', true),
  ('avatars', 'avatars', true),
  ('passage-images', 'passage-images', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public access to read objects in these buckets
CREATE POLICY "Public Access Audio" ON storage.objects FOR SELECT USING (bucket_id = 'listening-audio');
CREATE POLICY "Public Access Avatars" ON storage.objects FOR SELECT USING (bucket_id = 'avatars');
CREATE POLICY "Public Access Passage Images" ON storage.objects FOR SELECT USING (bucket_id = 'passage-images');

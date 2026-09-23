ALTER TABLE exam_attempts 
ADD COLUMN current_segment varchar(20),
ADD COLUMN reading_expires_at timestamptz,
ADD COLUMN listening_expires_at timestamptz;

-- Up migration

CREATE TABLE announcements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  body text,
  link_url text,
  link_label text,
  active_from timestamptz,
  active_until timestamptz,
  status text NOT NULL DEFAULT 'draft',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_announcements_status ON announcements (status);

ALTER TABLE gallery ADD COLUMN status text NOT NULL DEFAULT 'draft';

CREATE INDEX idx_gallery_status ON gallery (status);

-- Down migration

DROP INDEX IF EXISTS idx_gallery_status;

ALTER TABLE gallery DROP COLUMN IF EXISTS status;

DROP TABLE IF EXISTS announcements;

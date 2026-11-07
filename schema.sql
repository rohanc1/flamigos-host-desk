-- Optional: the API creates these tables by itself on first use. Run this only if you prefer to set them up by hand.
CREATE TABLE IF NOT EXISTS kv (k TEXT PRIMARY KEY, rev INTEGER NOT NULL, v TEXT NOT NULL, updated INTEGER);
CREATE TABLE IF NOT EXISTS img (id TEXT PRIMARY KEY, mime TEXT NOT NULL, data TEXT NOT NULL, created INTEGER);
CREATE TABLE IF NOT EXISTS fails (ip TEXT PRIMARY KEY, n INTEGER NOT NULL, t INTEGER NOT NULL);

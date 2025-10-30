import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';

export const supabase = createClient(supabaseUrl, supabaseKey);

// Database schema creation SQL
export const createTablesSQL = `
-- Create drivers table
CREATE TABLE IF NOT EXISTS drivers (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  phone_number TEXT NOT NULL,
  seats_available INT NOT NULL CHECK (seats_available > 0),
  pickup_area TEXT NOT NULL,
  leave_kfm_time TEXT,
  leave_ucla_time TEXT,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create riders table
CREATE TABLE IF NOT EXISTS riders (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  phone_number TEXT NOT NULL,
  seats_needed INT DEFAULT 1 CHECK (seats_needed > 0),
  pickup_area TEXT NOT NULL,
  notes TEXT,
  driver_id INT REFERENCES drivers(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_drivers_pickup_area ON drivers(pickup_area);
CREATE INDEX IF NOT EXISTS idx_riders_pickup_area ON riders(pickup_area);
CREATE INDEX IF NOT EXISTS idx_riders_driver_id ON riders(driver_id);

-- App state table to control dashboard visibility
CREATE TABLE IF NOT EXISTS app_state (
  id INT PRIMARY KEY DEFAULT 1,
  is_finalized BOOLEAN NOT NULL DEFAULT FALSE,
  updated_at TIMESTAMP DEFAULT NOW()
);
INSERT INTO app_state (id, is_finalized)
  VALUES (1, FALSE)
  ON CONFLICT (id) DO NOTHING;
`;

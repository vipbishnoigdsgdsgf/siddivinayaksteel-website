# 🚨 DATABASE SETUP URGENT

## Current Issues:
- Tables not created in Supabase
- Foreign key relationships missing
- Type errors due to missing schema

## IMMEDIATE ACTION REQUIRED:

### 1. Supabase Database Setup
```sql
-- Copy this entire SQL and run in Supabase SQL Editor:

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  username TEXT,
  avatar_url TEXT,
  bio TEXT,
  website TEXT,
  location TEXT,
  phone TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create projects table  
CREATE TABLE IF NOT EXISTS projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  images TEXT[],
  category TEXT,
  location TEXT,
  client_name TEXT,
  completion_date DATE,
  cost_range TEXT,
  materials_used TEXT[],
  created_by UUID REFERENCES profiles(id),
  is_featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES projects(id),
  reviewer_name TEXT NOT NULL,
  reviewer_email TEXT,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  is_approved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create meetings table  
CREATE TABLE IF NOT EXISTS meetings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  meeting_date TIMESTAMPTZ NOT NULL,
  location TEXT,
  max_participants INTEGER,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable public access
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE meetings ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Public projects viewable" ON projects FOR SELECT USING (true);
CREATE POLICY "Public reviews viewable" ON reviews FOR SELECT USING (is_approved = true);
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
```

### 2. After Database Setup:
1. Restart development server: `npm run dev`
2. Test website functionality
3. All errors should resolve

### 3. Next Steps:
Once database is working:
- Deploy to Vercel
- Configure domain
- Test production

## STATUS: ⚠️ BLOCKING ISSUE - Database tables required
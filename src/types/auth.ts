
export type Profile = {
  id: string;
  username: string | null;
  avatar_url: string | null;
  full_name: string | null;
  phone: string | null;
  location: string | null;
  created_at: string;
  updated_at: string;
};

export type Review = {
  id: string;
  user_id: string;
  project_id: string;
  rating: number;
  comment: string;
  created_at: string;
};

export type Project = {
  id: string;
  title: string;
  category: string | null;
  description: string | null;
  images: string[];
  user_id: string;
  created_at: string;
  updated_at: string;
};

export interface ReviewWithRelations {
  id: string;
  rating: number;
  comment: string;
  created_at: string;
  user_id: string;
  project_id: string;
  likes_count: number;
  location?: string | null;
  profiles: {
    username: string | null;
    avatar_url: string | null;
    full_name: string | null;
  };
  projects: {
    title: string;
    category: string | null;
    images: string[];
  };
}

// Add User type from Supabase
export interface User {
  id: string;
  app_metadata: {
    provider?: string;
    [key: string]: any;
  };
  user_metadata: {
    full_name?: string;
    avatar_url?: string;
    picture?: string;
    [key: string]: any;
  };
  aud: string;
  created_at: string;
  confirmed_at?: string;
  email?: string;
  phone?: string;
  last_sign_in_at?: string;
  role?: string;
  updated_at?: string;
}

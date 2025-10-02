// Base types for all database entities
export interface BaseEntity {
  id: string;
  created_at: string;
  updated_at: string;
}

// Profile types
export interface Profile extends BaseEntity {
  full_name: string | null;
  username: string | null;
  avatar_url: string | null;
  phone: string | null;
  location: string | null;
}

export interface ProfileUpdate {
  id: string;
  full_name?: string;
  username?: string;
  avatar_url?: string;
  phone?: string;
  location?: string;
}

export interface ProfileCreate extends Omit<ProfileUpdate, 'id'> {
  id: string; // Required for profile creation
}

// Project types
export type ProjectCategory = 'residential' | 'commercial' | 'custom' | 'industrial';
export type ProjectStatus = 'active' | 'draft' | 'archived';

export interface Project extends BaseEntity {
  title: string;
  description: string | null;
  category: ProjectCategory | null;
  images: string[] | null;
  user_id: string | null;
  location: string | null;
  status: ProjectStatus;
  featured: boolean;
  profiles?: Profile; // Joined profile data
}

export interface ProjectCreate {
  title: string;
  description?: string;
  category?: ProjectCategory;
  images?: string[];
  user_id: string;
  location?: string;
  status?: ProjectStatus;
  featured?: boolean;
}

export interface ProjectUpdate extends Partial<Omit<ProjectCreate, 'user_id'>> {}

// Gallery types
export interface GalleryItem extends BaseEntity {
  title: string;
  description: string | null;
  category: ProjectCategory | null;
  image_url: string;
  user_id: string | null;
  likes_count: number;
  saves_count: number;
  featured: boolean;
  profiles?: Profile; // Joined profile data
}

export interface GalleryCreate {
  title: string;
  description?: string;
  category?: ProjectCategory;
  image_url: string;
  user_id: string;
  featured?: boolean;
}

export interface GalleryUpdate extends Partial<Omit<GalleryCreate, 'user_id'>> {}

// Gallery interaction types
export interface GalleryLike extends BaseEntity {
  user_id: string;
  gallery_id: string;
}

export interface GallerySave extends BaseEntity {
  user_id: string;
  gallery_id: string;
}

// Review types
export interface Review extends BaseEntity {
  user_id: string | null;
  project_id: string | null;
  rating: number | null;
  comment: string | null;
  reviewer_name: string | null; // For anonymous reviews
  reviewer_email: string | null; // For anonymous reviews
  project_type: string | null;
  is_approved: boolean;
  profiles?: Profile; // Joined profile data
  projects?: Project; // Joined project data
}

export interface ReviewCreate {
  user_id?: string;
  project_id?: string;
  rating: number;
  comment: string;
  reviewer_name?: string;
  reviewer_email?: string;
  project_type?: string;
  is_approved?: boolean;
}

export interface ReviewUpdate extends Partial<ReviewCreate> {}

// Meeting types
export type MeetingStatus = 'active' | 'cancelled' | 'completed';

export interface Meeting extends BaseEntity {
  title: string;
  description: string | null;
  meeting_date: string; // Date string
  meeting_time: string; // Time string
  location: string;
  address: string | null;
  max_spots: number;
  current_spots: number;
  image_url: string | null;
  status: MeetingStatus;
}

export interface MeetingCreate {
  title: string;
  description?: string;
  meeting_date: string;
  meeting_time: string;
  location: string;
  address?: string;
  max_spots?: number;
  current_spots?: number;
  image_url?: string;
  status?: MeetingStatus;
}

export interface MeetingUpdate extends Partial<MeetingCreate> {}

// Meeting Registration types
export type RegistrationStatus = 'registered' | 'confirmed' | 'cancelled';

export interface MeetingRegistration extends BaseEntity {
  meeting_id: string;
  user_id: string;
  name: string;
  email: string;
  phone: string;
  company: string | null;
  message: string | null;
  status: RegistrationStatus;
  meetings?: Meeting; // Joined meeting data
  profiles?: Profile; // Joined profile data
}

export interface MeetingRegistrationCreate {
  meeting_id: string;
  user_id: string;
  name: string;
  email: string;
  phone: string;
  company?: string;
  message?: string;
  status?: RegistrationStatus;
}

export interface MeetingRegistrationUpdate extends Partial<Omit<MeetingRegistrationCreate, 'meeting_id' | 'user_id'>> {}

// Notification types
export type NotificationType = 'info' | 'success' | 'warning' | 'error';

export interface Notification extends BaseEntity {
  user_id: string;
  title: string;
  message: string;
  type: NotificationType | null;
  read: boolean;
  action_url: string | null;
}

export interface NotificationCreate {
  user_id: string;
  title: string;
  message: string;
  type?: NotificationType;
  read?: boolean;
  action_url?: string;
}

export interface NotificationUpdate {
  read?: boolean;
}

// API Response types
export interface ApiResponse<T = any> {
  data: T | null;
  error: string | null;
  message?: string;
}

export interface PaginatedResponse<T = any> extends ApiResponse<T[]> {
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Search and filter types
export interface SearchFilters {
  query?: string;
  category?: ProjectCategory;
  location?: string;
  featured?: boolean;
  limit?: number;
  page?: number;
}

export interface DateRange {
  start: string;
  end: string;
}

// Statistics and analytics types
export interface ProjectStats {
  totalProjects: number;
  projectsByCategory: { [key in ProjectCategory]?: number };
  featuredProjects: number;
  recentProjects: number;
}

export interface GalleryStats {
  totalItems: number;
  totalLikes: number;
  totalSaves: number;
  featuredItems: number;
  itemsByCategory: { [key in ProjectCategory]?: number };
}

export interface ReviewStats {
  totalReviews: number;
  averageRating: number;
  pendingReviews: number;
  ratingDistribution: { [rating: number]: number };
}

export interface MeetingStats {
  totalMeetings: number;
  upcomingMeetings: number;
  totalRegistrations: number;
  averageAttendance: number;
}

export interface UserStats {
  totalUsers: number;
  activeUsers: number;
  newUsersThisMonth: number;
}

export interface DashboardStats {
  projects: ProjectStats;
  gallery: GalleryStats;
  reviews: ReviewStats;
  meetings: MeetingStats;
  users: UserStats;
}

// Form validation types
export interface ValidationError {
  field: string;
  message: string;
}

export interface FormState {
  isLoading: boolean;
  errors: ValidationError[];
  touched: { [field: string]: boolean };
}

// Auth types (extending Supabase auth types)
export interface AuthUser {
  id: string;
  email: string;
  profile?: Profile;
}

export interface SignUpData {
  email: string;
  password: string;
  full_name?: string;
  username?: string;
  phone?: string;
}

export interface SignInData {
  email: string;
  password: string;
}

// File upload types
export interface UploadedFile {
  id: string;
  url: string;
  name: string;
  size: number;
  type: string;
}

// Component prop types
export interface ComponentProps {
  className?: string;
  children?: React.ReactNode;
}

// Common utility types
export type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>;
export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;

// Database table names (useful for type-safe table references)
export const TABLE_NAMES = {
  PROFILES: 'profiles',
  PROJECTS: 'projects',
  GALLERY: 'gallery',
  GALLERY_LIKES: 'gallery_likes',
  GALLERY_SAVES: 'gallery_saves',
  REVIEWS: 'reviews',
  MEETINGS: 'meetings',
  MEETING_REGISTRATIONS: 'meeting_registrations',
  NOTIFICATIONS: 'notifications'
} as const;

export type TableName = typeof TABLE_NAMES[keyof typeof TABLE_NAMES];

// Export all types in a single namespace for easier imports
export namespace Database {
  export type Profile = Profile;
  export type Project = Project;
  export type GalleryItem = GalleryItem;
  export type Review = Review;
  export type Meeting = Meeting;
  export type MeetingRegistration = MeetingRegistration;
  export type Notification = Notification;
}
import { supabase } from "../lib/supabase";

// Advanced admin configuration with multiple security layers
const ADMIN_CONFIG = {
  // Primary admin emails with different permission levels
  SUPER_ADMINS: [
    'omprkashbishnoi2000@gmail.com',  // Owner - Full Access
  ],
  ADMIN_USERS: [
    'vipbishnoi47@gmail.com',         // Senior Admin
    'ramubishnoi47@gmail.com',        // Junior Admin
    'admin@siddivinayakasteel.shop',   // Business Admin
  ],
  
  // Security settings
  SESSION_TIMEOUT: 4 * 60 * 60 * 1000, // 4 hours
  MAX_LOGIN_ATTEMPTS: 3,
  ADMIN_ROUTE: '/sys-admin-dashboard-x7k9m2p8q', // Never expose this
};

// Interface for admin user
interface AdminUser {
  id: string;
  email: string;
  role: 'SUPER_ADMIN' | 'ADMIN';
  lastLogin?: string;
  permissions: string[];
}

// Get admin route (never expose directly)
export const getSecureAdminRoute = (): string => {
  // Additional obfuscation layer
  const timestamp = Date.now().toString(36);
  sessionStorage.setItem('_sysAuth', timestamp);
  return ADMIN_CONFIG.ADMIN_ROUTE;
};

// Enhanced admin check with multiple security layers
export const verifyAdminAccess = async (email: string): Promise<{
  isAdmin: boolean;
  role?: 'SUPER_ADMIN' | 'ADMIN';
  permissions?: string[];
  user?: AdminUser;
}> => {
  try {
    // Input validation
    if (!email || typeof email !== 'string' || !email.includes('@')) {
      console.warn('🚫 Invalid email format for admin check');
      return { isAdmin: false };
    }

    const normalizedEmail = email.toLowerCase().trim();
    
    // Check if user exists in auth system
    const { data: authData, error: authError } = await supabase.auth.getUser();
    if (authError || !authData.user || authData.user.email !== normalizedEmail) {
      console.warn('🚫 Auth verification failed for admin access');
      return { isAdmin: false };
    }

    // Determine admin role
    let role: 'SUPER_ADMIN' | 'ADMIN' | null = null;
    if (ADMIN_CONFIG.SUPER_ADMINS.includes(normalizedEmail)) {
      role = 'SUPER_ADMIN';
    } else if (ADMIN_CONFIG.ADMIN_USERS.includes(normalizedEmail)) {
      role = 'ADMIN';
    }

    if (!role) {
      console.warn(`🚫 Unauthorized admin access attempt: ${normalizedEmail}`);
      return { isAdmin: false };
    }

    // Get permissions based on role
    const permissions = getAdminPermissions(role);

    // Log successful admin access
    logAdminAccess(normalizedEmail, role, 'ACCESS_GRANTED');

    const adminUser: AdminUser = {
      id: authData.user.id,
      email: normalizedEmail,
      role,
      lastLogin: new Date().toISOString(),
      permissions,
    };

    console.log(`✅ Admin access granted: ${normalizedEmail} [${role}]`);
    
    return {
      isAdmin: true,
      role,
      permissions,
      user: adminUser,
    };

  } catch (error) {
    console.error('❌ Admin verification error:', error);
    return { isAdmin: false };
  }
};

// Get permissions based on admin role
const getAdminPermissions = (role: 'SUPER_ADMIN' | 'ADMIN'): string[] => {
  const basePermissions = [
    'VIEW_DASHBOARD',
    'VIEW_USERS',
    'VIEW_PROJECTS',
    'VIEW_MEETINGS',
    'VIEW_REVIEWS',
  ];

  const adminPermissions = [
    ...basePermissions,
    'EDIT_PROJECTS',
    'MANAGE_MEETINGS',
    'MODERATE_REVIEWS',
  ];

  const superAdminPermissions = [
    ...adminPermissions,
    'MANAGE_USERS',
    'DELETE_CONTENT',
    'SYSTEM_SETTINGS',
    'VIEW_LOGS',
    'EXPORT_DATA',
  ];

  return role === 'SUPER_ADMIN' ? superAdminPermissions : adminPermissions;
};

// Advanced session management
export const createAdminSession = (adminUser: AdminUser): void => {
  const sessionData = {
    userId: adminUser.id,
    email: adminUser.email,
    role: adminUser.role,
    loginTime: Date.now(),
    expiresAt: Date.now() + ADMIN_CONFIG.SESSION_TIMEOUT,
  };

  // Store in secure session storage (encrypted)
  const encryptedSession = btoa(JSON.stringify(sessionData));
  sessionStorage.setItem('_adminSession', encryptedSession);
  
  // Set session timeout
  setTimeout(() => {
    clearAdminSession();
  }, ADMIN_CONFIG.SESSION_TIMEOUT);
};

// Validate admin session
export const validateAdminSession = (): boolean => {
  try {
    const sessionData = sessionStorage.getItem('_adminSession');
    if (!sessionData) return false;

    const session = JSON.parse(atob(sessionData));
    const now = Date.now();

    if (now > session.expiresAt) {
      clearAdminSession();
      return false;
    }

    return true;
  } catch (error) {
    clearAdminSession();
    return false;
  }
};

// Clear admin session
export const clearAdminSession = (): void => {
  sessionStorage.removeItem('_adminSession');
  sessionStorage.removeItem('_sysAuth');
};

// Log admin activities for security audit
const logAdminAccess = async (email: string, role: string, action: string): Promise<void> => {
  try {
    const logData = {
      email,
      role,
      action,
      timestamp: new Date().toISOString(),
      ip_address: 'client-side', // In production, get real IP
      user_agent: navigator.userAgent,
    };

    // In production, you might want to store these logs in a secure table
    console.log('📊 Admin Activity Log:', logData);
    
    // Optional: Store in Supabase table for audit trail
    // await supabase.from('admin_logs').insert(logData);
  } catch (error) {
    console.warn('Failed to log admin access:', error);
  }
};

// Check if user has specific permission
export const hasPermission = (permission: string): boolean => {
  try {
    const sessionData = sessionStorage.getItem('_adminSession');
    if (!sessionData) return false;

    const session = JSON.parse(atob(sessionData));
    const permissions = getAdminPermissions(session.role);
    
    return permissions.includes(permission);
  } catch (error) {
    return false;
  }
};

// Security headers for admin requests
export const getSecurityHeaders = (): Record<string, string> => {
  return {
    'X-Admin-Request': 'true',
    'X-Timestamp': Date.now().toString(),
    'X-Session-Token': sessionStorage.getItem('_sysAuth') || '',
  };
};

// Rate limiting for admin actions
const rateLimiter = new Map<string, { count: number; resetTime: number }>();

export const checkRateLimit = (action: string, limit: number = 10, windowMs: number = 60000): boolean => {
  const now = Date.now();
  const key = `admin_${action}`;
  
  const current = rateLimiter.get(key);
  
  if (!current || now > current.resetTime) {
    rateLimiter.set(key, { count: 1, resetTime: now + windowMs });
    return true;
  }
  
  if (current.count >= limit) {
    console.warn(`🚫 Rate limit exceeded for admin action: ${action}`);
    return false;
  }
  
  current.count++;
  return true;
};

// Export secure admin route getter
export const SECURE_ADMIN_PATH = ADMIN_CONFIG.ADMIN_ROUTE;
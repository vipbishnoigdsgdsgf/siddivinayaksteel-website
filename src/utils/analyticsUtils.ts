import { supabase } from '@/lib/supabase';

// Interface for visitor tracking data
export interface VisitorData {
  id?: string;
  visit_date: string;
  page_path: string;
  user_agent: string;
  ip_address?: string;
  referrer?: string;
  session_id: string;
  created_at?: string;
}

// Interface for analytics summary
export interface AnalyticsSummary {
  total_visits: number;
  unique_visitors: number;
  today_visits: number;
  weekly_visits: number;
  monthly_visits: number;
  popular_pages: Array<{
    page: string;
    visits: number;
  }>;
  daily_stats: Array<{
    date: string;
    visits: number;
  }>;
}

// Generate a session ID for tracking unique visits
export const generateSessionId = (): string => {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// Get or create session ID from localStorage
export const getSessionId = (): string => {
  let sessionId = localStorage.getItem('visitor_session_id');
  
  if (!sessionId) {
    sessionId = generateSessionId();
    localStorage.setItem('visitor_session_id', sessionId);
  }
  
  return sessionId;
};

// Track a page visit
export const trackPageVisit = async (pagePath: string): Promise<void> => {
  try {
    const sessionId = getSessionId();
    const visitData: VisitorData = {
      visit_date: new Date().toISOString().split('T')[0], // YYYY-MM-DD format
      page_path: pagePath,
      user_agent: navigator.userAgent,
      referrer: document.referrer || null,
      session_id: sessionId,
      created_at: new Date().toISOString()
    };

    console.log('📊 Tracking page visit:', pagePath);

    // Store in Supabase (if table exists)
    const { error } = await supabase
      .from('website_analytics')
      .insert([visitData]);

    if (error) {
      console.warn('Failed to store analytics data:', error);
      // Fall back to localStorage if database fails
      storeAnalyticsLocally(visitData);
    } else {
      console.log('✅ Analytics data stored successfully');
    }
  } catch (error) {
    console.error('Error tracking page visit:', error);
    // Always fall back to localStorage
    storeAnalyticsLocally({
      visit_date: new Date().toISOString().split('T')[0],
      page_path: pagePath,
      user_agent: navigator.userAgent,
      referrer: document.referrer || null,
      session_id: getSessionId(),
      created_at: new Date().toISOString()
    });
  }
};

// Store analytics data locally as fallback
const storeAnalyticsLocally = (visitData: VisitorData): void => {
  try {
    const existingData = JSON.parse(localStorage.getItem('website_analytics') || '[]');
    existingData.push(visitData);
    
    // Keep only last 1000 entries to avoid localStorage overflow
    if (existingData.length > 1000) {
      existingData.splice(0, existingData.length - 1000);
    }
    
    localStorage.setItem('website_analytics', JSON.stringify(existingData));
    console.log('📊 Analytics stored locally as fallback');
  } catch (error) {
    console.error('Failed to store analytics locally:', error);
  }
};

// Get analytics summary from database or localStorage
export const getAnalyticsSummary = async (): Promise<AnalyticsSummary> => {
  try {
    // Try to get from Supabase first
    const { data: analyticsData, error } = await supabase
      .from('website_analytics')
      .select('*')
      .order('created_at', { ascending: false });

    let analytics: VisitorData[] = [];

    if (error || !analyticsData) {
      console.log('📊 Loading analytics from localStorage');
      // Fall back to localStorage
      analytics = JSON.parse(localStorage.getItem('website_analytics') || '[]');
    } else {
      analytics = analyticsData;
      console.log('📊 Loaded analytics from database:', analytics.length, 'records');
    }

    return calculateAnalyticsSummary(analytics);
  } catch (error) {
    console.error('Error getting analytics summary:', error);
    return {
      total_visits: 0,
      unique_visitors: 0,
      today_visits: 0,
      weekly_visits: 0,
      monthly_visits: 0,
      popular_pages: [],
      daily_stats: []
    };
  }
};

// Calculate analytics summary from raw data
const calculateAnalyticsSummary = (analytics: VisitorData[]): AnalyticsSummary => {
  const today = new Date().toISOString().split('T')[0];
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  const monthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  // Count visits
  const todayVisits = analytics.filter(a => a.visit_date === today).length;
  const weeklyVisits = analytics.filter(a => a.visit_date >= weekAgo).length;
  const monthlyVisits = analytics.filter(a => a.visit_date >= monthAgo).length;

  // Count unique visitors (by session_id)
  const uniqueVisitors = new Set(analytics.map(a => a.session_id)).size;

  // Popular pages
  const pageCount: { [key: string]: number } = {};
  analytics.forEach(a => {
    pageCount[a.page_path] = (pageCount[a.page_path] || 0) + 1;
  });
  
  const popularPages = Object.entries(pageCount)
    .map(([page, visits]) => ({ page, visits }))
    .sort((a, b) => b.visits - a.visits)
    .slice(0, 10);

  // Daily stats for last 7 days
  const dailyStats: { [key: string]: number } = {};
  for (let i = 6; i >= 0; i--) {
    const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    dailyStats[date] = analytics.filter(a => a.visit_date === date).length;
  }

  const daily_stats = Object.entries(dailyStats)
    .map(([date, visits]) => ({ date, visits }));

  return {
    total_visits: analytics.length,
    unique_visitors,
    today_visits: todayVisits,
    weekly_visits: weeklyVisits,
    monthly_visits: monthlyVisits,
    popular_pages: popularPages,
    daily_stats
  };
};

// Hook to track page visits automatically
export const usePageTracking = (pagePath: string) => {
  React.useEffect(() => {
    trackPageVisit(pagePath);
  }, [pagePath]);
};

// For React import
import React from 'react';
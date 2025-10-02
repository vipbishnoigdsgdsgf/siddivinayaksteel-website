import { supabase } from '../lib/supabase';
import type { Notification, NotificationCreate } from '../types/database';

export class NotificationService {
  // Get user's notifications
  static async getUserNotifications(
    userId: string,
    limit?: number,
    unreadOnly = false
  ): Promise<Notification[]> {
    try {
      let query = supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (unreadOnly) {
        query = query.eq('read', false);
      }

      if (limit) {
        query = query.limit(limit);
      }

      const { data, error } = await query;

      if (error) {
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Error fetching user notifications:', error);
      throw error;
    }
  }

  // Get notification by ID
  static async getNotification(id: string): Promise<Notification | null> {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('id', id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error fetching notification:', error);
      throw error;
    }
  }

  // Create notification
  static async createNotification(notification: NotificationCreate): Promise<Notification> {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .insert(notification)
        .select()
        .single();

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error creating notification:', error);
      throw error;
    }
  }

  // Mark notification as read
  static async markAsRead(id: string): Promise<Notification> {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  }

  // Mark all user notifications as read
  static async markAllAsRead(userId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('user_id', userId)
        .eq('read', false);

      if (error) {
        throw error;
      }
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      throw error;
    }
  }

  // Delete notification
  static async deleteNotification(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }
    } catch (error) {
      console.error('Error deleting notification:', error);
      throw error;
    }
  }

  // Get unread count for user
  static async getUnreadCount(userId: string): Promise<number> {
    try {
      const { count, error } = await supabase
        .from('notifications')
        .select('id', { count: 'exact' })
        .eq('user_id', userId)
        .eq('read', false);

      if (error) {
        throw error;
      }

      return count || 0;
    } catch (error) {
      console.error('Error fetching unread notification count:', error);
      throw error;
    }
  }

  // Bulk create notifications
  static async createBulkNotifications(notifications: NotificationCreate[]): Promise<Notification[]> {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .insert(notifications)
        .select();

      if (error) {
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Error creating bulk notifications:', error);
      throw error;
    }
  }

  // Delete old notifications (cleanup)
  static async deleteOldNotifications(daysOld = 30): Promise<void> {
    try {
      const date = new Date();
      date.setDate(date.getDate() - daysOld);
      const dateString = date.toISOString();

      const { error } = await supabase
        .from('notifications')
        .delete()
        .lt('created_at', dateString)
        .eq('read', true);

      if (error) {
        throw error;
      }
    } catch (error) {
      console.error('Error deleting old notifications:', error);
      throw error;
    }
  }

  // Helper methods for creating specific notification types

  // Meeting registration confirmation
  static async notifyMeetingRegistration(
    userId: string,
    meetingTitle: string,
    meetingId: string
  ): Promise<Notification> {
    return this.createNotification({
      user_id: userId,
      title: 'Meeting Registration Confirmed',
      message: `You have successfully registered for "${meetingTitle}". Check your email for more details.`,
      type: 'success',
      action_url: `/meetings/${meetingId}`
    });
  }

  // Review approval notification
  static async notifyReviewApproved(
    userId: string,
    projectTitle: string,
    reviewId: string
  ): Promise<Notification> {
    return this.createNotification({
      user_id: userId,
      title: 'Review Approved',
      message: `Your review for "${projectTitle}" has been approved and is now public.`,
      type: 'success',
      action_url: `/reviews/${reviewId}`
    });
  }

  // New project notification
  static async notifyNewProject(
    userId: string,
    projectTitle: string,
    projectId: string
  ): Promise<Notification> {
    return this.createNotification({
      user_id: userId,
      title: 'New Project Added',
      message: `A new project "${projectTitle}" has been added that might interest you.`,
      type: 'info',
      action_url: `/projects/${projectId}`
    });
  }

  // Gallery item liked notification
  static async notifyGalleryLiked(
    userId: string,
    galleryTitle: string,
    galleryId: string
  ): Promise<Notification> {
    return this.createNotification({
      user_id: userId,
      title: 'Your Work Was Liked',
      message: `Someone liked your gallery item "${galleryTitle}".`,
      type: 'info',
      action_url: `/gallery/${galleryId}`
    });
  }

  // Meeting reminder notification
  static async notifyMeetingReminder(
    userId: string,
    meetingTitle: string,
    meetingId: string
  ): Promise<Notification> {
    return this.createNotification({
      user_id: userId,
      title: 'Meeting Reminder',
      message: `Don't forget about your upcoming meeting: "${meetingTitle}" tomorrow.`,
      type: 'warning',
      action_url: `/meetings/${meetingId}`
    });
  }
}
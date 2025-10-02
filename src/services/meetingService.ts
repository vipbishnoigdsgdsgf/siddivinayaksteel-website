import { supabase } from '../lib/supabase';
import type { Meeting, MeetingCreate, MeetingUpdate, MeetingRegistration, MeetingRegistrationCreate } from '../types/database';

export class MeetingService {
  // Get all active meetings
  static async getMeetings(limit?: number): Promise<Meeting[]> {
    try {
      let query = supabase
        .from('meetings')
        .select('*')
        .eq('status', 'active')
        .order('meeting_date', { ascending: true });

      if (limit) {
        query = query.limit(limit);
      }

      const { data, error } = await query;

      if (error) {
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Error fetching meetings:', error);
      throw error;
    }
  }

  // Get upcoming meetings
  static async getUpcomingMeetings(limit = 3): Promise<Meeting[]> {
    try {
      const today = new Date().toISOString().split('T')[0];
      
      const { data, error } = await supabase
        .from('meetings')
        .select('*')
        .eq('status', 'active')
        .gte('meeting_date', today)
        .order('meeting_date', { ascending: true })
        .limit(limit);

      if (error) {
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Error fetching upcoming meetings:', error);
      throw error;
    }
  }

  // Get meeting by ID
  static async getMeeting(id: string): Promise<Meeting | null> {
    try {
      const { data, error } = await supabase
        .from('meetings')
        .select('*')
        .eq('id', id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error fetching meeting:', error);
      throw error;
    }
  }

  // Create meeting (admin only)
  static async createMeeting(meeting: MeetingCreate): Promise<Meeting> {
    try {
      const { data, error } = await supabase
        .from('meetings')
        .insert(meeting)
        .select()
        .single();

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error creating meeting:', error);
      throw error;
    }
  }

  // Update meeting (admin only)
  static async updateMeeting(id: string, updates: MeetingUpdate): Promise<Meeting> {
    try {
      const { data, error } = await supabase
        .from('meetings')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error updating meeting:', error);
      throw error;
    }
  }

  // Delete meeting (admin only)
  static async deleteMeeting(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('meetings')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }
    } catch (error) {
      console.error('Error deleting meeting:', error);
      throw error;
    }
  }

  // Register for meeting
  static async registerForMeeting(registration: MeetingRegistrationCreate): Promise<MeetingRegistration> {
    try {
      // First, check if there are available spots
      const meeting = await this.getMeeting(registration.meeting_id);
      if (!meeting) {
        throw new Error('Meeting not found');
      }

      if (meeting.current_spots >= meeting.max_spots) {
        throw new Error('Meeting is full');
      }

      const { data, error } = await supabase
        .from('meeting_registrations')
        .insert(registration)
        .select(`
          *,
          meetings (
            id,
            title,
            meeting_date,
            meeting_time,
            location
          )
        `)
        .single();

      if (error) {
        throw error;
      }

      // Update current spots count
      await supabase
        .from('meetings')
        .update({ current_spots: meeting.current_spots + 1 })
        .eq('id', registration.meeting_id);

      return data;
    } catch (error) {
      console.error('Error registering for meeting:', error);
      throw error;
    }
  }

  // Get user's meeting registrations
  static async getUserRegistrations(userId: string): Promise<MeetingRegistration[]> {
    try {
      const { data, error } = await supabase
        .from('meeting_registrations')
        .select(`
          *,
          meetings (
            id,
            title,
            description,
            meeting_date,
            meeting_time,
            location,
            address,
            status
          )
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Error fetching user registrations:', error);
      throw error;
    }
  }

  // Cancel meeting registration
  static async cancelRegistration(registrationId: string): Promise<void> {
    try {
      // First get the registration to update spots count
      const { data: registration, error: fetchError } = await supabase
        .from('meeting_registrations')
        .select('meeting_id')
        .eq('id', registrationId)
        .single();

      if (fetchError) {
        throw fetchError;
      }

      // Delete the registration
      const { error: deleteError } = await supabase
        .from('meeting_registrations')
        .delete()
        .eq('id', registrationId);

      if (deleteError) {
        throw deleteError;
      }

      // Update current spots count
      const meeting = await this.getMeeting(registration.meeting_id);
      if (meeting && meeting.current_spots > 0) {
        await supabase
          .from('meetings')
          .update({ current_spots: meeting.current_spots - 1 })
          .eq('id', registration.meeting_id);
      }
    } catch (error) {
      console.error('Error canceling meeting registration:', error);
      throw error;
    }
  }

  // Update registration status (admin only)
  static async updateRegistrationStatus(
    registrationId: string,
    status: 'registered' | 'confirmed' | 'cancelled'
  ): Promise<MeetingRegistration> {
    try {
      const { data, error } = await supabase
        .from('meeting_registrations')
        .update({ status })
        .eq('id', registrationId)
        .select(`
          *,
          meetings (
            id,
            title,
            meeting_date,
            meeting_time,
            location
          )
        `)
        .single();

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error updating registration status:', error);
      throw error;
    }
  }

  // Get meeting registrations (admin only)
  static async getMeetingRegistrations(meetingId: string): Promise<MeetingRegistration[]> {
    try {
      const { data, error } = await supabase
        .from('meeting_registrations')
        .select(`
          *,
          profiles (
            id,
            full_name,
            username,
            avatar_url
          )
        `)
        .eq('meeting_id', meetingId)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Error fetching meeting registrations:', error);
      throw error;
    }
  }

  // Check if user is registered for meeting
  static async checkUserRegistration(userId: string, meetingId: string): Promise<MeetingRegistration | null> {
    try {
      const { data, error } = await supabase
        .from('meeting_registrations')
        .select(`
          *,
          meetings (
            id,
            title,
            meeting_date,
            meeting_time,
            location
          )
        `)
        .eq('user_id', userId)
        .eq('meeting_id', meetingId)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error checking user registration:', error);
      throw error;
    }
  }

  // Get meeting statistics (admin only)
  static async getMeetingStats(): Promise<{
    totalMeetings: number;
    upcomingMeetings: number;
    totalRegistrations: number;
    averageAttendance: number;
  }> {
    try {
      const today = new Date().toISOString().split('T')[0];

      const [meetingsResult, upcomingResult, registrationsResult] = await Promise.all([
        supabase.from('meetings').select('id', { count: 'exact' }),
        supabase.from('meetings').select('id', { count: 'exact' }).gte('meeting_date', today),
        supabase.from('meeting_registrations').select('id', { count: 'exact' })
      ]);

      const totalMeetings = meetingsResult.count || 0;
      const upcomingMeetings = upcomingResult.count || 0;
      const totalRegistrations = registrationsResult.count || 0;
      const averageAttendance = totalMeetings > 0 ? totalRegistrations / totalMeetings : 0;

      return {
        totalMeetings,
        upcomingMeetings,
        totalRegistrations,
        averageAttendance: Math.round(averageAttendance * 100) / 100
      };
    } catch (error) {
      console.error('Error fetching meeting stats:', error);
      throw error;
    }
  }
}
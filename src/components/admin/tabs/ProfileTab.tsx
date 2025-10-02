import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Camera, 
  Save, 
  Shield, 
  Key,
  Bell,
  Settings,
  Upload,
  Edit3
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";

interface AdminProfileProps {
  adminUser: any;
  adminRole: 'SUPER_ADMIN' | 'ADMIN' | null;
  onProfileUpdate?: () => void;
}

export function ProfileTab({ adminUser, adminRole, onProfileUpdate }: AdminProfileProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [avatarLoading, setAvatarLoading] = useState(false);
  
  const [profileData, setProfileData] = useState({
    full_name: adminUser?.full_name || '',
    username: adminUser?.username || '',
    email: adminUser?.email || user?.email || '',
    phone: adminUser?.phone || '',
    location: adminUser?.location || '',
    bio: adminUser?.bio || '',
    avatar_url: adminUser?.avatar_url || ''
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleProfileChange = (field: string, value: string) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePasswordChange = (field: string, value: string) => {
    setPasswordData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const updateProfile = async () => {
    if (!user?.id) {
      toast.error('User not authenticated');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: profileData.full_name,
          username: profileData.username,
          phone: profileData.phone,
          location: profileData.location,
          bio: profileData.bio,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (error) throw error;

      toast.success('✅ Profile updated successfully!');
      if (onProfileUpdate) onProfileUpdate();
    } catch (error: any) {
      console.error('Profile update error:', error);
      toast.error('Failed to update profile: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const updatePassword = async () => {
    if (!passwordData.newPassword || !passwordData.confirmPassword) {
      toast.error('Please fill all password fields');
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: passwordData.newPassword
      });

      if (error) throw error;

      toast.success('🔐 Password updated successfully!');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error: any) {
      console.error('Password update error:', error);
      toast.error('Failed to update password: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user?.id) return;

    // Validate file type and size
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    if (file.size > 2 * 1024 * 1024) { // 2MB limit
      toast.error('Image size should be less than 2MB');
      return;
    }

    setAvatarLoading(true);
    try {
      // Create unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `avatar-${user.id}-${Date.now()}.${fileExt}`;

      // Upload to Supabase storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      // Update profile with new avatar URL
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', user.id);

      if (updateError) throw updateError;

      setProfileData(prev => ({ ...prev, avatar_url: publicUrl }));
      toast.success('📸 Avatar updated successfully!');
      if (onProfileUpdate) onProfileUpdate();

    } catch (error: any) {
      console.error('Avatar upload error:', error);
      toast.error('Failed to upload avatar: ' + error.message);
    } finally {
      setAvatarLoading(false);
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  };

  return (
    <div className="space-y-4 sm:space-y-6 max-w-4xl mx-auto">
      {/* Mobile-first Header */}
      <div className="text-center sm:text-left">
        <h2 className="text-xl sm:text-2xl font-bold text-white">Admin Profile</h2>
        <p className="text-gray-400 text-sm sm:text-base">Manage your admin account settings</p>
      </div>

      {/* Profile Picture & Basic Info */}
      <Card className="bg-dark-200 border-gray-800">
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
            {/* Avatar Section */}
            <div className="relative">
              <div className="h-20 w-20 sm:h-24 sm:w-24 rounded-full bg-gradient-to-br from-steel to-steel-dark flex items-center justify-center ring-4 ring-steel/30 overflow-hidden">
                {profileData.avatar_url ? (
                  <img
                    src={profileData.avatar_url}
                    alt="Admin Avatar"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="text-white font-bold text-lg sm:text-xl">
                    {getInitials(profileData.full_name || profileData.email)}
                  </span>
                )}
              </div>
              
              {/* Upload Button */}
              <label className="absolute -bottom-1 -right-1 bg-steel hover:bg-steel/80 rounded-full p-2 cursor-pointer transition-colors">
                <Camera className="h-4 w-4 text-white" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  className="hidden"
                  disabled={avatarLoading}
                />
              </label>
              
              {avatarLoading && (
                <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                  <div className="h-6 w-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
            </div>

            {/* Basic Info */}
            <div className="text-center sm:text-left flex-1">
              <h3 className="text-lg sm:text-xl font-bold text-white">
                {profileData.full_name || 'Admin User'}
              </h3>
              <p className="text-gray-400 text-sm">{profileData.email}</p>
              <div className="flex items-center justify-center sm:justify-start mt-2">
                <Shield className="h-4 w-4 text-steel mr-2" />
                <span className="text-steel font-medium text-sm">
                  {adminRole === 'SUPER_ADMIN' ? 'Super Administrator' : 'Administrator'}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Profile Information Form */}
      <Card className="bg-dark-200 border-gray-800">
        <CardHeader className="pb-4">
          <CardTitle className="text-white flex items-center text-lg">
            <User className="h-5 w-5 mr-2" />
            Personal Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="full_name" className="text-white text-sm">Full Name</Label>
              <Input
                id="full_name"
                value={profileData.full_name}
                onChange={(e) => handleProfileChange('full_name', e.target.value)}
                className="bg-dark-300 border-gray-700 text-white mt-1"
                placeholder="Your full name"
              />
            </div>
            <div>
              <Label htmlFor="username" className="text-white text-sm">Username</Label>
              <Input
                id="username"
                value={profileData.username}
                onChange={(e) => handleProfileChange('username', e.target.value)}
                className="bg-dark-300 border-gray-700 text-white mt-1"
                placeholder="Your username"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="email" className="text-white text-sm">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={profileData.email}
                readOnly
                className="bg-dark-300 border-gray-700 text-gray-400 mt-1"
                placeholder="Your email"
              />
              <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
            </div>
            <div>
              <Label htmlFor="phone" className="text-white text-sm">Phone Number</Label>
              <Input
                id="phone"
                value={profileData.phone}
                onChange={(e) => handleProfileChange('phone', e.target.value)}
                className="bg-dark-300 border-gray-700 text-white mt-1"
                placeholder="+91 9876543210"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="location" className="text-white text-sm">Location</Label>
            <Input
              id="location"
              value={profileData.location}
              onChange={(e) => handleProfileChange('location', e.target.value)}
              className="bg-dark-300 border-gray-700 text-white mt-1"
              placeholder="City, State, Country"
            />
          </div>

          <div>
            <Label htmlFor="bio" className="text-white text-sm">Bio</Label>
            <Textarea
              id="bio"
              value={profileData.bio}
              onChange={(e) => handleProfileChange('bio', e.target.value)}
              className="bg-dark-300 border-gray-700 text-white mt-1 resize-none"
              placeholder="Tell us about yourself..."
              rows={3}
            />
          </div>

          <Button
            onClick={updateProfile}
            disabled={loading}
            className="w-full sm:w-auto bg-steel hover:bg-steel/80 text-white"
          >
            {loading ? (
              <div className="flex items-center">
                <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Updating...
              </div>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Password Change */}
      <Card className="bg-dark-200 border-gray-800">
        <CardHeader className="pb-4">
          <CardTitle className="text-white flex items-center text-lg">
            <Key className="h-5 w-5 mr-2" />
            Change Password
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="newPassword" className="text-white text-sm">New Password</Label>
            <Input
              id="newPassword"
              type="password"
              value={passwordData.newPassword}
              onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
              className="bg-dark-300 border-gray-700 text-white mt-1"
              placeholder="Enter new password"
            />
          </div>

          <div>
            <Label htmlFor="confirmPassword" className="text-white text-sm">Confirm New Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={passwordData.confirmPassword}
              onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
              className="bg-dark-300 border-gray-700 text-white mt-1"
              placeholder="Confirm new password"
            />
          </div>

          <div className="bg-yellow-900/20 border border-yellow-700 rounded-lg p-3">
            <p className="text-yellow-400 text-sm">
              <Shield className="h-4 w-4 inline mr-1" />
              Password must be at least 6 characters long
            </p>
          </div>

          <Button
            onClick={updatePassword}
            disabled={loading || !passwordData.newPassword || !passwordData.confirmPassword}
            className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white"
          >
            {loading ? (
              <div className="flex items-center">
                <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Updating...
              </div>
            ) : (
              <>
                <Key className="h-4 w-4 mr-2" />
                Update Password
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Admin Preferences */}
      <Card className="bg-dark-200 border-gray-800">
        <CardHeader className="pb-4">
          <CardTitle className="text-white flex items-center text-lg">
            <Settings className="h-5 w-5 mr-2" />
            Admin Preferences
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-dark-300 rounded-lg">
              <div className="flex items-center space-x-3">
                <Bell className="h-5 w-5 text-steel" />
                <div>
                  <p className="text-white font-medium text-sm">Email Notifications</p>
                  <p className="text-gray-400 text-xs">Receive notifications for new messages</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-steel"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-3 bg-dark-300 rounded-lg">
              <div className="flex items-center space-x-3">
                <Shield className="h-5 w-5 text-steel" />
                <div>
                  <p className="text-white font-medium text-sm">Two-Factor Auth</p>
                  <p className="text-gray-400 text-xs">Enhanced security for your account</p>
                </div>
              </div>
              <Button size="sm" variant="outline" className="border-gray-700 text-white hover:bg-dark-300 text-xs">
                Setup
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
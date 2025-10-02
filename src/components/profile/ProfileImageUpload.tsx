import { useState } from 'react';
import { toast } from "sonner";
import { supabase } from '../../lib/supabase';
import { Upload, Loader2 } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/context/AuthContext';

export default function ProfileImageUpload() {
  const { user, profile, setProfile } = useAuth();
  const [uploading, setUploading] = useState(false);

  if (!user) return null;
  
  const defaultAvatar = "/favicon.png";
  const initials = profile?.full_name 
    ? profile.full_name.split(' ').map(n => n[0]).join('').toUpperCase()
    : profile?.username?.[0]?.toUpperCase() || 'S';

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (!event.target.files || event.target.files.length === 0) return;

      const file = event.target.files[0];
      
      // File checks (2MB limit + valid extensions)
      if (file.size > 2 * 1024 * 1024) {
        toast.error("Maximum size is 2MB!");
        return;
      }
      
      const fileExt = file.name.split('.').pop();
      if (!['jpg', 'jpeg', 'png', 'gif'].includes(fileExt?.toLowerCase() || '')) {
        toast.error("Only JPG/PNG/GIF allowed!");
        return;
      }
      
      // 🔥 SECURE UPLOAD: User-specific folder + timestamp
      const filePath = `user_${user.id}/${Date.now()}.${fileExt}`;
      setUploading(true);

      // Create bucket if missing (with RLS-friendly settings)
      const { data: buckets } = await supabase.storage.listBuckets();
      if (!buckets?.some(b => b.name === 'avatars')) {
        await supabase.storage.createBucket('avatars', {
          public: false, // Start private!
          allowedMimeTypes: ['image/*'],
          fileSizeLimit: '2MB'
        });
      }

      // Upload (private by default)
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: false });

      if (uploadError) throw uploadError;

      // Generate public URL
      const { data: urlData } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      // ✅ STRICT PROFILE UPDATE: Only current user!
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ 
          avatar_url: urlData.publicUrl,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (updateError) throw updateError;

      // Update UI
      setProfile({ ...profile!, avatar_url: urlData.publicUrl });
      toast.success("DP updated! 🚀");
    } catch (error) {
      toast.error("Failed to upload. Try again!");
      console.error("Upload error:", error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-start space-y-4">
      <div className="relative">
        <Avatar className="h-32 w-32 border-4 border-steel shadow-[0_0_15px_rgba(14,183,234,0.4)]">
          <AvatarImage src={profile?.avatar_url || defaultAvatar} alt="Profile" />
          <AvatarFallback className="bg-steel text-white text-4xl">
            {initials}
          </AvatarFallback>
        </Avatar>
        <label 
          htmlFor="avatar-upload" 
          className="absolute bottom-0 right-0 h-9 w-9 bg-steel text-white rounded-full flex items-center justify-center cursor-pointer hover:bg-steel-dark"
        >
          {uploading ? <Loader2 className="animate-spin" /> : <Upload />}
        </label>
        <input
          id="avatar-upload"
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          disabled={uploading}
          className="hidden"
        />
      </div>
      <div className="text-left w-full">
        <h3 className="text-lg font-medium text-white">
          {profile?.full_name || profile?.username}
        </h3>
        <p className="text-sm text-gray-400">{user.email}</p>
      </div>
      <div className="text-xs text-gray-500">
        JPG/PNG/GIF (max 2MB)
      </div>
    </div>
  );
}

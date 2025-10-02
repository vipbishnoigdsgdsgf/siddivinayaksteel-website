
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { User, Settings, LogOut, Heart, Bookmark, FileText } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';

export default function UserAvatar() {
  const {
    user,
    profile,
    signOut
  } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const {
    toast
  } = useToast();
  
  if (!user || !profile) return null;
  
  const defaultAvatar = "/favicon.png";
  const initials = profile.full_name 
    ? profile.full_name.split(' ').map(n => n[0]).join('').toUpperCase() 
    : profile.username?.[0]?.toUpperCase() || 'S';
  
  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: "Signed out successfully",
        description: "You have been logged out from your account"
      });
      navigate('/');
    } catch (error) {
      console.error("Sign out error:", error);
      toast({
        title: "Error signing out",
        description: "There was a problem signing out. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsOpen(false);
    }
  };
  
  const handleProfileClick = (path: string) => {
    navigate(path);
    setIsOpen(false);
  };
  
  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0 neumorphic">
          <Avatar className="h-10 w-10 border border-steel/50">
            <AvatarImage 
              src={profile.avatar_url || defaultAvatar} 
              alt={profile.full_name || 'User'} 
            />
            <AvatarFallback className="bg-steel text-white">{initials}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent className="w-64 bg-dark-200 shadow-neumorphic border-none rounded-xl" align="end">
        <div className="flex items-center justify-start gap-3 p-4 border-b border-dark-300">
          <Avatar className="h-10 w-10 border border-steel/30">
            <AvatarImage 
              src={profile.avatar_url || defaultAvatar} 
              alt={profile.full_name || 'User'} 
            />
            <AvatarFallback className="bg-steel text-white">{initials}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <p className="text-sm font-medium text-white">{profile.full_name || profile.username}</p>
            <p className="text-xs text-gray-400">{user.email}</p>
          </div>
        </div>
        
        <DropdownMenuItem className="cursor-pointer flex items-center gap-2 text-gray-300 focus:bg-dark-300 focus:text-white hover:bg-dark-300 hover:text-steel" onClick={() => handleProfileClick(`/profile/${user.id}`)}>
          <User size={16} className="text-steel" />
          <span>Your Profile</span>
        </DropdownMenuItem>
        
        <DropdownMenuItem className="cursor-pointer flex items-center gap-2 text-gray-300 focus:bg-dark-300 focus:text-white hover:bg-dark-300 hover:text-steel" onClick={() => handleProfileClick(`/profile/${user.id}?tab=projects`)}>
          <FileText size={16} className="text-steel" />
          <span>Your Reviews</span>
        </DropdownMenuItem>
        
        <DropdownMenuItem className="cursor-pointer flex items-center gap-2 text-gray-300 focus:bg-dark-300 focus:text-white hover:bg-dark-300 hover:text-steel" onClick={() => handleProfileClick(`/profile/${user.id}?tab=saved`)}>
          <Bookmark size={16} className="text-steel" />
          <span>Saved Projects</span>
        </DropdownMenuItem>
        
        <DropdownMenuItem className="cursor-pointer flex items-center gap-2 text-gray-300 focus:bg-dark-300 focus:text-white hover:bg-dark-300 hover:text-steel" onClick={() => handleProfileClick(`/profile/${user.id}?tab=likes`)}>
          <Heart size={16} className="text-steel" />
          <span>Liked Projects</span>
        </DropdownMenuItem>
        
        <DropdownMenuItem className="cursor-pointer flex items-center gap-2 text-gray-300 focus:bg-dark-300 focus:text-white hover:bg-dark-300 hover:text-steel" onClick={() => handleProfileClick('/profile/settings')}>
          <Settings size={16} className="text-steel" />
          <span>Settings</span>
        </DropdownMenuItem>
        
        <DropdownMenuItem className="cursor-pointer flex items-center gap-2 text-gray-300 focus:bg-dark-300 focus:text-white hover:bg-dark-300 hover:text-steel border-t border-dark-300 mt-2" onClick={handleSignOut}>
          <LogOut size={16} className="text-red-500" />
          <span>Logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

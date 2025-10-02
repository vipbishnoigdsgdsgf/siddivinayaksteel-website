
import { Button } from "@/components/ui/button";
import { Settings, MapPin, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Profile } from "@/types/auth";
import { useAuth } from "@/context/AuthContext";
import { obfuscateEmail, obfuscatePhone } from "@/utils/privacyUtils";

interface ProfileHeaderProps {
  profileData: Profile | null;
  isCurrentUser: boolean;
}

export function ProfileHeader({ profileData, isCurrentUser }: ProfileHeaderProps) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const defaultAvatar = "/favicon.png";
  
  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };
  
  return (
    <div className="relative">
      <div className="h-56 md:h-80 overflow-hidden relative bg-dark-200">
        <img
          src="/assets/profilebanner2.jpg"
          alt="Profile Banner"
          className="w-full h-full object-cover object-center scale-105 transition-transform duration-500 hover:scale-110"
          loading="lazy"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = "/assets/profilebanner2.jpg";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-dark-100/90" />
        <div className="absolute inset-0 bg-gradient-to-t from-dark-100/80 to-transparent" />
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative -mt-20 sm:-mt-28 sm:flex sm:items-end sm:space-x-6 sm:pb-16">
          <div className="flex">
            <div className="h-28 w-28 md:h-36 md:w-36 rounded-full ring-4 ring-steel/20 ring-offset-2 ring-offset-dark-100 overflow-hidden bg-dark-200 shadow-2xl">
              <img
                src={profileData?.avatar_url || defaultAvatar}
                alt={profileData?.full_name || "User"}
                className="h-full w-full object-cover"
              />
            </div>
          </div>
          <div className="mt-6 sm:mt-0 sm:flex-1 min-w-0">
            <div className="flex items-center space-x-3">
              <h1 className="text-2xl font-bold text-white truncate">{profileData?.full_name || profileData?.username || "User"}</h1>
            </div>
            <div className="mt-2 text-gray-400 text-sm">
              {isCurrentUser ? "Welcome to your profile" : `User profile`}
            </div>
            <div className="mt-4 flex flex-wrap gap-4">
              {user?.email && (
                <div className="flex items-center text-gray-400 text-sm">
                  <span>{isCurrentUser ? user.email : obfuscateEmail(user.email)}</span>
                </div>
              )}
              {profileData?.phone && (
                <div className="flex items-center text-gray-400 text-sm">
                  <span>{isCurrentUser ? profileData.phone : obfuscatePhone(profileData.phone)}</span>
                </div>
              )}
              {profileData?.location && (
                <div className="flex items-center text-gray-400 text-sm">
                  <MapPin className="h-4 w-4 mr-1 text-steel" />
                  <span>{profileData.location}</span>
                </div>
              )}
              <div className="flex items-center text-gray-400 text-sm">
                <span>Joined {new Date(profileData?.created_at || "").toLocaleDateString()}</span>
              </div>
            </div>
          </div>
          <div className="mt-6 flex flex-col sm:mt-0 sm:flex-row gap-2">
            {isCurrentUser && (
              <>
                <Button onClick={() => navigate('/profile/settings')} className="bg-steel hover:bg-steel-dark">
                  <Settings className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
                <Button onClick={handleLogout} variant="outline" className="border-red-500 text-red-500 hover:bg-red-500/10">
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

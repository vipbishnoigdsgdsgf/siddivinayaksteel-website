
import { Avatar } from "@/components/ui/avatar";
import { User } from "@/types/auth";

interface ProfileAvatarProps {
  user: User | null;
  className?: string;
}

export function ProfileAvatar({ user, className = "" }: ProfileAvatarProps) {
  // Extract initials from user's email or name
  const getInitials = () => {
    if (!user) return "?";
    
    if (user.user_metadata?.full_name) {
      const names = user.user_metadata.full_name.split(" ");
      if (names.length >= 2) {
        return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
      }
      return names[0][0].toUpperCase();
    }
    
    if (user.email) {
      return user.email[0].toUpperCase();
    }
    
    return "U";
  };

  // Get avatar URL from user metadata if available
  const avatarUrl = user?.user_metadata?.avatar_url || user?.user_metadata?.picture || "";

  return (
    <Avatar className={`bg-steel border-2 border-steel ${className}`}>
      {avatarUrl ? (
        <img 
          src={avatarUrl} 
          alt="User avatar" 
          className="object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
          }}
        />
      ) : (
        <div className="flex items-center justify-center w-full h-full bg-steel text-white font-medium">
          {getInitials()}
        </div>
      )}
    </Avatar>
  );
}

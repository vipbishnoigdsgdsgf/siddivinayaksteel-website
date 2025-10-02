
import { Menu, X, Bell, Settings, LogOut, Shield, User } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/context/AuthContext";
import { clearAdminSession } from "@/utils/adminSecurity";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

interface AdminHeaderProps {
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  activeTabName: string;
  adminUser?: any;
  adminRole?: 'SUPER_ADMIN' | 'ADMIN';
}

export function AdminHeader({ 
  mobileMenuOpen, 
  setMobileMenuOpen, 
  activeTabName, 
  adminUser, 
  adminRole 
}: AdminHeaderProps) {
  const [notifications] = useState(3); // Real notifications count will be implemented
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      clearAdminSession();
      await signOut();
      toast.success("👋 Signed out successfully");
      navigate("/");
    } catch (error) {
      console.error("Signout error:", error);
      toast.error("Failed to sign out");
    }
  };

  const getInitials = (user: any) => {
    if (user?.full_name) {
      return user.full_name.split(' ').map((n: string) => n[0]).join('').toUpperCase();
    }
    if (user?.email) {
      return user.email[0].toUpperCase();
    }
    return 'A';
  };

  return (
    <header className="bg-dark-200 border-b border-gray-800 shadow-lg sticky top-0 z-30">
      <div className="px-2 sm:px-4 lg:px-8 h-14 sm:h-16 flex items-center justify-between">
        {/* Left side - Title and mobile menu */}
        <div className="flex items-center space-x-2 sm:space-x-4 flex-1 min-w-0">
          <button
            className="lg:hidden p-3 rounded-xl text-gray-400 hover:text-white hover:bg-dark-300 transition-colors active:scale-95"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
          <div className="min-w-0 flex-1">
            <h1 className="text-base sm:text-lg lg:text-2xl font-bold text-white truncate">{activeTabName}</h1>
            <p className="text-xs text-gray-400 hidden sm:block">
              {adminRole === 'SUPER_ADMIN' ? '🔥 Super Admin' : '⚡ Admin'}
            </p>
          </div>
        </div>

        {/* Right side - Notifications and Profile */}
        <div className="flex items-center space-x-1 sm:space-x-3">
          {/* Notifications */}
          <div className="relative hidden sm:block">
            <Button
              variant="ghost"
              size="sm"
              className="relative p-2 text-gray-400 hover:text-white hover:bg-dark-300 transition-colors"
            >
              <Bell className="h-5 w-5" />
              {notifications > 0 && (
                <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                  {notifications > 9 ? '9+' : notifications}
                </span>
              )}
            </Button>
          </div>

          {/* Admin Profile Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 sm:h-12 sm:w-12 rounded-full p-1 hover:bg-dark-300 transition-colors active:scale-95">
                <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-gradient-to-br from-steel to-steel-dark flex items-center justify-center ring-2 ring-steel/30 hover:ring-steel/60 transition-all">
                  {adminUser?.avatar_url ? (
                    <img
                      src={adminUser.avatar_url}
                      alt="Admin Avatar"
                      className="h-8 w-8 sm:h-10 sm:w-10 rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-white font-bold text-sm sm:text-base">
                      {getInitials(adminUser)}
                    </span>
                  )}
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-72 sm:w-80 bg-dark-200 border-gray-700" align="end">
              {/* Profile Header */}
              <div className="px-4 py-4 border-b border-gray-700">
                <div className="flex items-center space-x-3">
                  <div className="h-14 w-14 rounded-full bg-gradient-to-br from-steel to-steel-dark flex items-center justify-center ring-2 ring-steel/30">
                    {adminUser?.avatar_url ? (
                      <img
                        src={adminUser.avatar_url}
                        alt="Admin Avatar"
                        className="h-14 w-14 rounded-full object-cover"
                      />
                    ) : (
                      <span className="text-white font-bold text-lg">
                        {getInitials(adminUser)}
                      </span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-semibold text-base truncate">
                      {adminUser?.full_name || adminUser?.username || 'Administrator'}
                    </p>
                    <p className="text-sm text-gray-400 truncate">{adminUser?.email}</p>
                    <div className="flex items-center mt-1">
                      <Shield className="h-4 w-4 text-steel mr-2" />
                      <span className="text-sm text-steel font-medium">
                        {adminRole === 'SUPER_ADMIN' ? 'Super Admin' : 'Admin'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Menu Items */}
              <DropdownMenuItem className="text-gray-300 hover:text-white hover:bg-dark-300 cursor-pointer py-3 px-4">
                <User className="mr-3 h-5 w-5" />
                <span className="text-base">Profile Settings</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="text-gray-300 hover:text-white hover:bg-dark-300 cursor-pointer py-3 px-4">
                <Bell className="mr-3 h-5 w-5" />
                <span className="text-base">Notifications</span>
                {notifications > 0 && (
                  <span className="ml-auto bg-red-500 text-white text-sm px-2 py-1 rounded-full font-medium">
                    {notifications}
                  </span>
                )}
              </DropdownMenuItem>
              {adminRole === 'SUPER_ADMIN' && (
                <DropdownMenuItem className="text-gray-300 hover:text-white hover:bg-dark-300 cursor-pointer py-3 px-4">
                  <Settings className="mr-3 h-5 w-5" />
                  <span className="text-base">System Settings</span>
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator className="bg-gray-700 my-2" />
              <DropdownMenuItem 
                className="text-red-400 hover:text-red-300 hover:bg-red-500/10 cursor-pointer py-3 px-4"
                onClick={handleSignOut}
              >
                <LogOut className="mr-3 h-5 w-5" />
                <span className="text-base font-medium">Sign Out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}


import { useState, useEffect, FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MenuIcon, X, Search, Shield } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import UserAvatar from "@/components/UserAvatar";
import { Input } from "@/components/ui/input";
import { useIsMobile } from "@/hooks/use-mobile";
import { verifyAdminAccess, getSecureAdminRoute } from "@/utils/adminSecurity";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isUserAdmin, setIsUserAdmin] = useState(false);
  const [adminRole, setAdminRole] = useState<'SUPER_ADMIN' | 'ADMIN' | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  // --- Check admin status ---
  useEffect(() => {
    const checkAdminStatus = async () => {
      if (user?.email) {
        const adminAccess = await verifyAdminAccess(user.email);
        setIsUserAdmin(adminAccess.isAdmin);
        setAdminRole(adminAccess.role || null);
      } else {
        setIsUserAdmin(false);
        setAdminRole(null);
      }
    };
    checkAdminStatus();
  }, [user]);

  // --- Scroll logo state ---
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    function handleScroll() {
      if (window.scrollY > 60) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    }
    window.addEventListener("scroll", handleScroll, {
      passive: true
    });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
      setMobileMenuOpen(false);
    }
  };

  return (
    <nav className="fixed top-0 w-full bg-dark-100/98 backdrop-blur-md z-[100] border-b border-dark-300 shadow-lg">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-4 sm:gap-8">
            <Link to="/" className="flex items-center min-w-[80px]">
              {/* Replace text with logo when scrolled */}
                  <span className="relative flex items-center transition-all duration-300 h-10">
                {!scrolled ? (
                  <span className="flex items-center animate-fade-in" style={{ minWidth: 180 }}>
                    <span className="text-lg sm:text-xl font-bold text-steel transition-opacity">Siddhi Vinayaka</span>
                    <span className="ml-1 text-lg sm:text-xl font-bold text-white transition-opacity">Steel</span>
                  </span>
                ) : (
                  <img 
                    alt="Siddhi Vinayaka Steel Logo" 
                    loading="lazy" 
                    src="/siddhi-vinayak-logo.png"
                    className="h-10 sm:h-12 w-auto rounded-lg shadow-lg animate-fade-in object-contain" 
                  />
                )}
              </span>
            </Link>
            
            <div className="hidden md:block relative">
              <form onSubmit={handleSearch} className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                <Input 
                  placeholder="Search..." 
                  className="bg-dark-200 pl-10 w-64 h-9" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </form>
            </div>
          </div>
          
          {/* Desktop menu */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-1 lg:space-x-2">
              <Link to="/">
                <Button variant="ghost" className="rounded-xl">
                  Home
                </Button>
              </Link>
              <Link to="/about">
                <Button variant="ghost" className="rounded-xl">
                  About
                </Button>
              </Link>
              <Link to="/services">
                <Button variant="ghost" className="rounded-xl">
                  Services
                </Button>
              </Link>
              <Link to="/gallery">
                <Button variant="ghost" className="rounded-xl">
                  gallery
                </Button>
              </Link>
              <Link to="/contact">
                <Button variant="ghost" className="rounded-xl">
                  Contact
                </Button>
              </Link>
              {isUserAdmin && (
                <Link to={getSecureAdminRoute()}>
                  <Button variant="ghost" className="rounded-xl text-steel hover:text-steel-light" title="Admin Dashboard">
                    <Shield className="h-4 w-4 mr-1" />
                    {adminRole === 'SUPER_ADMIN' ? 'Super Admin' : 'Admin'}
                  </Button>
                </Link>
              )}
            </div>
          </div>

          {/* Auth buttons or User Avatar */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <UserAvatar />
            ) : (
              <>
                <Link to="/login">
                  <Button variant="outline" className="rounded-xl">
                    Login
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button variant="steel" className="rounded-xl">
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-4">
            {user && <UserAvatar />}
            
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
              className="neumorphic-button p-2" 
              aria-label="Menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6 text-steel" />
              ) : (
                <MenuIcon className="h-6 w-6 text-steel" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu - with improved animation and accessibility */}
      {mobileMenuOpen && (
        <div 
          className="md:hidden bg-dark-200 border-b border-dark-300 animate-fade-in"
          aria-label="Mobile navigation menu"
        >
          <div className="px-3 py-4 space-y-3">
            <form onSubmit={handleSearch} className="relative mb-4">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
              <Input 
                placeholder="Search..." 
                className="bg-dark-300 pl-10 w-full" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </form>

            <Link to="/" className="neumorphic-button block w-full text-center" onClick={() => setMobileMenuOpen(false)}>
              Home
            </Link>
            <Link to="/about" className="neumorphic-button block w-full text-center" onClick={() => setMobileMenuOpen(false)}>
              About
            </Link>
            <Link to="/services" className="neumorphic-button block w-full text-center" onClick={() => setMobileMenuOpen(false)}>
              Services
            </Link>
            <Link to="/gallery" className="neumorphic-button block w-full text-center" onClick={() => setMobileMenuOpen(false)}>
              gallery
            </Link>
            <Link to="/contact" className="neumorphic-button block w-full text-center" onClick={() => setMobileMenuOpen(false)}>
              Contact
            </Link>
            
            {isUserAdmin && (
              <Link to={getSecureAdminRoute()} className="neumorphic-button block w-full text-center text-steel" onClick={() => setMobileMenuOpen(false)}>
                <Shield className="h-4 w-4 inline mr-2" />
                {adminRole === 'SUPER_ADMIN' ? 'Super Admin' : 'Admin Dashboard'}
              </Link>
            )}
            
            {!user && (
              <div className="pt-4 pb-2 border-t border-dark-300 flex flex-col gap-3">
                <Link to="/login" className="neumorphic-button block w-full text-center" onClick={() => setMobileMenuOpen(false)}>
                  Login
                </Link>
                <Button 
                  variant="steel" 
                  className="w-full rounded-xl" 
                  onClick={() => {
                    navigate('/signup');
                    setMobileMenuOpen(false);
                  }}
                >
                  Sign Up
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}


import { Link } from "react-router-dom";
import { 
  LayoutDashboard, 
  Users, 
  FolderKanban, 
  MessageSquare, 
  Calendar, 
  Settings, 
  LogOut,
  Menu,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface NavigationItem {
  name: string;
  href: string;
  icon: React.ElementType;
  count: number | null;
  id: string;
}

interface AdminSidebarProps {
  navigation: NavigationItem[];
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  activeTab: string;
  handleNavClick: (tabId: string) => void;
}

export function AdminSidebar({ 
  navigation, 
  sidebarOpen, 
  setSidebarOpen,
  mobileMenuOpen,
  setMobileMenuOpen, 
  activeTab,
  handleNavClick 
}: AdminSidebarProps) {
  const handleMobileNavClick = (tabId: string) => {
    handleNavClick(tabId);
    setMobileMenuOpen(false); // Close mobile menu after navigation
  };

  return (
    <>
      {/* Mobile sidebar overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm" 
            onClick={() => setMobileMenuOpen(false)}
          ></div>
          
          <div className="fixed inset-y-0 left-0 w-80 max-w-[85vw] bg-dark-200 border-r border-gray-800 shadow-2xl transform transition-transform duration-300 ease-out">
            <div className="flex items-center justify-between p-4 h-16 border-b border-gray-800 bg-gradient-to-r from-dark-200 to-dark-300">
              <div className="flex items-center">
                <div>
                  <span className="text-xl font-bold text-steel">Sri Ganesh Steel</span>
                  <p className="text-xs text-gray-400 mt-0.5">Admin Dashboard</p>
                </div>
              </div>
              <button
                type="button"
                className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-dark-300 transition-colors duration-200"
                onClick={() => setMobileMenuOpen(false)}
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <nav className="mt-4 px-3 space-y-2 flex-1 overflow-y-auto max-h-[calc(100vh-8rem)]">
              {navigation.map((item) => (
                <button
                  key={item.name}
                  className={`group w-full flex items-center px-4 py-4 rounded-lg text-left transition-all duration-200 ${
                    activeTab === item.id
                      ? 'bg-steel text-white shadow-lg shadow-steel/25'
                      : 'text-gray-300 hover:bg-dark-300 hover:text-white'
                  }`}
                  onClick={() => handleMobileNavClick(item.id)}
                >
                  <item.icon 
                    className={`h-6 w-6 flex-shrink-0 transition-colors duration-200 ${
                      activeTab === item.id ? 'text-white' : 'text-gray-400 group-hover:text-white'
                    }`} 
                    aria-hidden="true" 
                  />
                  <span className="ml-4 flex-1 font-medium text-base transition-colors duration-200">{item.name}</span>
                  {item.count !== null && item.count > 0 && (
                    <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-semibold transition-all duration-200 ${
                      activeTab === item.id 
                        ? 'bg-white text-steel' 
                        : 'bg-gray-700 text-gray-300 group-hover:bg-steel group-hover:text-white'
                    }`}>
                      {item.count}
                    </span>
                  )}
                </button>
              ))}
            </nav>
            
            <div className="p-4 border-t border-gray-800 bg-dark-300">
              <Link to="/">
                <Button 
                  variant="outline" 
                  className="w-full justify-start text-gray-300 border-gray-600 hover:bg-red-600 hover:border-red-600 hover:text-white transition-all duration-200 group py-3"
                >
                  <LogOut className="mr-3 h-5 w-5 group-hover:animate-pulse" />
                  <span className="font-medium">Sign Out</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
      
      {/* Desktop sidebar */}
      <div className={`hidden lg:fixed lg:inset-y-0 lg:flex lg:flex-col lg:z-40 ${
        sidebarOpen ? 'lg:w-64' : 'lg:w-20'
      } transition-all ease-in-out duration-300`}>
      <div className="flex-1 flex flex-col bg-dark-200 border-r border-gray-800 shadow-xl">
        <div className="flex items-center justify-between p-4 h-16 border-b border-gray-800 bg-gradient-to-r from-dark-200 to-dark-300">
          <div className="flex items-center">
            {sidebarOpen ? (
              <div>
                <span className="text-xl font-bold text-steel">Sri Ganesh Steel</span>
                <p className="text-xs text-gray-400 mt-0.5">Admin Dashboard</p>
              </div>
            ) : (
              <div className="text-center">
                <span className="text-xl font-bold text-steel">SGS</span>
              </div>
            )}
          </div>
          <button
            type="button"
            className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-dark-300 transition-colors duration-200"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <span className="sr-only">Toggle sidebar</span>
            {sidebarOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
              </svg>
            )}
          </button>
        </div>
        <nav className="mt-4 px-2 space-y-1 flex-1 overflow-y-auto">
          {navigation.map((item) => (
            <button
              key={item.name}
              className={`group w-full flex items-center px-4 py-3 rounded-lg text-left transition-all duration-200 ${
                activeTab === item.id
                  ? 'bg-steel text-white shadow-lg shadow-steel/25'
                  : 'text-gray-300 hover:bg-dark-300 hover:text-white'
              }`}
              onClick={() => handleNavClick(item.id)}
            >
              <item.icon 
                className={`h-5 w-5 flex-shrink-0 transition-colors duration-200 ${
                  activeTab === item.id ? 'text-white' : 'text-gray-400 group-hover:text-white'
                }`} 
                aria-hidden="true" 
              />
              {sidebarOpen && (
                <>
                  <span className="ml-3 flex-1 font-medium transition-colors duration-200">{item.name}</span>
                  {item.count !== null && item.count > 0 && (
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold transition-all duration-200 ${
                      activeTab === item.id 
                        ? 'bg-white text-steel' 
                        : 'bg-gray-700 text-gray-300 group-hover:bg-steel group-hover:text-white'
                    }`}>
                      {item.count}
                    </span>
                  )}
                </>
              )}
              {!sidebarOpen && item.count !== null && item.count > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                  {item.count > 99 ? '99+' : item.count}
                </span>
              )}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-gray-800 bg-dark-300">
          <Link to="/">
            <Button 
              variant="outline" 
              className={`${
                sidebarOpen ? 'w-full justify-start' : 'w-full justify-center'
              } text-gray-300 border-gray-600 hover:bg-red-600 hover:border-red-600 hover:text-white transition-all duration-200 group`}
            >
              <LogOut className={`${sidebarOpen ? "mr-3 h-5 w-5" : "h-5 w-5"} group-hover:animate-pulse`} />
              {sidebarOpen && <span className="font-medium">Sign Out</span>}
            </Button>
          </Link>
        </div>
      </div>
    </div>
    </>
  );
}

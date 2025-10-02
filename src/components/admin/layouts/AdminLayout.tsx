import React from 'react';
import { AdminSidebar } from '../AdminSidebar';
import { AdminHeader } from '../AdminHeader';

interface NavigationItem {
  name: string;
  href: string;
  icon: React.ElementType;
  count: number | null;
  id: string;
}

interface AdminLayoutProps {
  navigation: NavigationItem[];
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  activeTab: string;
  handleNavClick: (tabId: string) => void;
  activeTabName: string;
  adminUser: any;
  adminRole: 'SUPER_ADMIN' | 'ADMIN' | null;
  children: React.ReactNode;
}

export function AdminLayout({
  navigation,
  sidebarOpen,
  setSidebarOpen,
  mobileMenuOpen,
  setMobileMenuOpen,
  activeTab,
  handleNavClick,
  activeTabName,
  adminUser,
  adminRole,
  children
}: AdminLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-100 via-dark-100 to-dark-200">
      {/* Admin Sidebar */}
      <AdminSidebar 
        navigation={navigation}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
        activeTab={activeTab}
        handleNavClick={handleNavClick}
      />

      {/* Main Content Area */}
      <div className={`min-h-screen ${
        sidebarOpen ? 'lg:pl-64' : 'lg:pl-20'
      } transition-all duration-300 ease-in-out`}>
        
        {/* Admin Header */}
        <AdminHeader 
          mobileMenuOpen={mobileMenuOpen}
          setMobileMenuOpen={setMobileMenuOpen}
          activeTabName={activeTabName}
          adminUser={adminUser}
          adminRole={adminRole}
        />

        {/* Main Content */}
        <main className="p-3 sm:p-4 lg:p-6 xl:p-8">
          <div className="max-w-full lg:max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
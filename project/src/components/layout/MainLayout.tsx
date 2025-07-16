import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';
import { useAuth } from '../../contexts/AuthContext';
import { Outlet } from 'react-router-dom';

const MainLayout: React.FC = () => {
  const { user } = useAuth();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  if (!user) return null;

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-dark-950 to-dark-900 dark:from-dark-950 dark:to-dark-900 from-white to-white">
      <Navbar user={user} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          user={user}
          isCollapsed={isSidebarCollapsed}
          onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        />
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout; 
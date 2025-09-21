// Admin context for managing user permissions and content
import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'editor' | 'viewer';
  permissions: string[];
}

interface AdminContextType {
  currentUser: User | null;
  isAdmin: boolean;
  canEdit: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  checkPermission: (permission: string) => boolean;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Mock authentication - in real app, this would connect to your backend
  const login = async (email: string, password: string): Promise<boolean> => {
    // Mock admin credentials
    if (email === 'admin@scribbledcanvas.com' && password === 'admin123') {
      const adminUser: User = {
        id: '1',
        name: 'Admin User',
        email: 'admin@scribbledcanvas.com',
        role: 'admin',
        permissions: ['edit_homepage', 'edit_artworks', 'manage_users']
      };
      setCurrentUser(adminUser);
      localStorage.setItem('scribbledcanvas_user', JSON.stringify(adminUser));
      return true;
    }
    
    // Mock editor credentials
    if (email === 'editor@scribbledcanvas.com' && password === 'editor123') {
      const editorUser: User = {
        id: '2',
        name: 'Editor User',
        email: 'editor@scribbledcanvas.com',
        role: 'editor',
        permissions: ['edit_homepage', 'edit_artworks']
      };
      setCurrentUser(editorUser);
      localStorage.setItem('scribbledcanvas_user', JSON.stringify(editorUser));
      return true;
    }
    
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('scribbledcanvas_user');
  };

  const checkPermission = (permission: string): boolean => {
    return currentUser?.permissions.includes(permission) || false;
  };

  // Check for existing session on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('scribbledcanvas_user');
    if (savedUser) {
      try {
        setCurrentUser(JSON.parse(savedUser));
      } catch (error) {
        localStorage.removeItem('artforge_user');
      }
    }
  }, []);

  const value: AdminContextType = {
    currentUser,
    isAdmin: currentUser?.role === 'admin',
    canEdit: currentUser?.role === 'admin' || currentUser?.role === 'editor',
    login,
    logout,
    checkPermission
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
};

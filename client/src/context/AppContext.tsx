import React, { createContext, useContext, useState, useEffect } from 'react';

type UserRole = 'student' | 'admin' | 'seating_manager' | 'club_coordinator' | null;

interface AppState {
  userRole: UserRole;
  login: (role: UserRole) => void;
  logout: () => void;
  examMode: boolean;
  toggleExamMode: () => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

const AppContext = createContext<AppState | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [userRole, setUserRole] = useState<UserRole>(null);
  const [examMode, setExamMode] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);

  // Initialize dark mode class on body
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const login = (role: UserRole) => setUserRole(role);
  const logout = () => setUserRole(null);
  const toggleExamMode = () => setExamMode(prev => !prev);
  const toggleDarkMode = () => setIsDarkMode(prev => !prev);

  return (
    <AppContext.Provider value={{ userRole, login, logout, examMode, toggleExamMode, isDarkMode, toggleDarkMode }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}

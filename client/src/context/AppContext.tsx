import React, { createContext, useContext, useState } from 'react';

type UserRole = 'student' | 'admin' | 'seating_manager' | 'club_coordinator' | null;

interface AppState {
  userRole: UserRole;
  login: (role: UserRole) => void;
  logout: () => void;
  examMode: boolean;
  toggleExamMode: () => void;
}

const AppContext = createContext<AppState | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [userRole, setUserRole] = useState<UserRole>(null);
  const [examMode, setExamMode] = useState(false);

  const login = (role: UserRole) => setUserRole(role);
  const logout = () => setUserRole(null);
  const toggleExamMode = () => setExamMode(prev => !prev);

  return (
    <AppContext.Provider value={{ userRole, login, logout, examMode, toggleExamMode }}>
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

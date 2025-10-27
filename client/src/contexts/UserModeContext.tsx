import { createContext, useContext, useState, ReactNode } from 'react';

type UserMode = 'seller' | 'buyer';

interface UserModeContextType {
  userMode: UserMode;
  setUserMode: (mode: UserMode) => void;
  toggleMode: () => void;
}

const UserModeContext = createContext<UserModeContextType | undefined>(undefined);

export function UserModeProvider({ children }: { children: ReactNode }) {
  const [userMode, setUserMode] = useState<UserMode>('seller');

  const toggleMode = () => {
    setUserMode(prev => prev === 'seller' ? 'buyer' : 'seller');
  };

  return (
    <UserModeContext.Provider value={{ userMode, setUserMode, toggleMode }}>
      {children}
    </UserModeContext.Provider>
  );
}

export function useUserMode() {
  const context = useContext(UserModeContext);
  if (context === undefined) {
    throw new Error('useUserMode must be used within a UserModeProvider');
  }
  return context;
}

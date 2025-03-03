import { useContext } from 'react';
import { AuthContext } from './AuthContext';
import { AuthContextType } from './authTypes';

// Custom hook to use the auth context
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
import { createContext, useEffect, useState, ReactNode, useCallback } from 'react';
import { 
  User,
  onAuthStateChanged,
  isSignInWithEmailLink
} from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { AuthContextType } from './authTypes';
import { sendLoginLink, signInWithLink, logout } from './authUtils';
import { auth } from './config'
// Initialize the context with undefined
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider component
export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  // Wrap the utility functions to include navigation and state updates
  const handleSendLoginLink = async (email: string) => {
    return sendLoginLink(email);
  };

  const handleSignInWithLink = useCallback(async (email: string) => {
    try {
      if (!isSignInWithEmailLink(auth, window.location.href)) {
        return Promise.reject(new Error('Invalid sign-in link'));
      }
      
      await signInWithLink(email, window.location.href);
      
      // Redirect to generator after successful login
      navigate('/generator');
      
      return Promise.resolve();
    } catch (error) {
      return Promise.reject(error);
    }
  }, [ navigate]);

  const handleLogout = async () => {
    try {
      await logout();
      return Promise.resolve();
    } catch (error) {
      return Promise.reject(error);
    }
  };

  // Set up auth state listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // Define handleEmailLink at component level with useCallback
  const handleEmailLink = useCallback(async () => {
    if (isSignInWithEmailLink(auth, window.location.href)) {
      let email = window.localStorage.getItem('emailForSignIn');
      
      if (!email) {
        // If no email in storage, prompt the user
        email = window.prompt('Please provide your email for confirmation');
      }
      
      if (email) {
        setLoading(true);
        try {
          await handleSignInWithLink(email);
        } catch (error) {
          console.error('Error signing in with email link:', error);
        } finally {
          setLoading(false);
        }
      }
    }
  }, [ handleSignInWithLink]);

  // Handle email sign-in if we have a link in the URL
  useEffect(() => {
    if (!loading) {
      handleEmailLink();
    }
  }, [loading, handleEmailLink]);

  const value = {
    currentUser,
    loading,
    sendLoginLink: handleSendLoginLink,
    signInWithLink: handleSignInWithLink,
    logout: handleLogout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

// Export the context to be used by the hook
export { AuthContext };
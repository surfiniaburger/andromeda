// src/firebase/authUtils.ts
import { 
    getAuth, 
    sendSignInLinkToEmail,
    signInWithEmailLink,
    signOut
  } from 'firebase/auth';
  import { actionCodeSettings } from './authTypes';
  
  // Send email link for authentication
  export const sendLoginLink = async (email: string): Promise<void> => {
    const auth = getAuth();
    try {
      await sendSignInLinkToEmail(auth, email, actionCodeSettings);
      window.localStorage.setItem('emailForSignIn', email);
      return Promise.resolve();
    } catch (error) {
      return Promise.reject(error);
    }
  };
  
  // Sign in with the email link
  export const signInWithLink = async (email: string, url: string): Promise<void> => {
    const auth = getAuth();
    try {
      await signInWithEmailLink(auth, email, url);
      
      // Clear email from storage
      window.localStorage.removeItem('emailForSignIn');
      
      // Clear the URL to remove the sign-in link parameters
      window.history.replaceState({}, document.title, window.location.pathname);
      
      return Promise.resolve();
    } catch (error) {
      return Promise.reject(error);
    }
  };
  
  // Sign out
  export const logout = async (): Promise<void> => {
    const auth = getAuth();
    return signOut(auth);
  };
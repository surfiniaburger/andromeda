// src/firebase/authTypes.ts

export interface AuthContextType {
    currentUser: import('firebase/auth').User | null;
    loading: boolean;
    sendLoginLink: (email: string) => Promise<void>;
    signInWithLink: (email: string) => Promise<void>;
    logout: () => Promise<void>;
  }
  
  // Email link settings
  export const actionCodeSettings = {
    url: window.location.origin + '/login',
    handleCodeInApp: true,
  };
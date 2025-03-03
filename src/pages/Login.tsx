// src/pages/Login.tsx
import { useState, useEffect } from 'react';
import { useAuth } from '../firebase/useAuth';
import { getAuth, isSignInWithEmailLink } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';

export function Login() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isLinkSent, setIsLinkSent] = useState(false);
  const [isProcessingLink, setIsProcessingLink] = useState(false);
  
  const { currentUser, sendLoginLink, signInWithLink } = useAuth();
  const navigate = useNavigate();
  const auth = getAuth();

  // Check if this is a sign-in with email link
  useEffect(() => {
    const checkEmailLink = async () => {
      if (isSignInWithEmailLink(auth, window.location.href)) {
        setIsProcessingLink(true);
        
        const emailFromStorage = window.localStorage.getItem('emailForSignIn');
        
        if (!emailFromStorage) {
          setEmail('');
          return;
        }
        
        setEmail(emailFromStorage);
        setLoading(true);
        
        try {
          await signInWithLink(emailFromStorage);
          // Navigation is handled in the AuthContext
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
          setError(`Error signing in with email link: ${errorMessage}`);
          console.error(error);
        } finally {
          setLoading(false);
          setIsProcessingLink(false);
        }
      }
    };
    
    checkEmailLink();
  }, [auth, signInWithLink]);

  // If user is already logged in, redirect to generator
  useEffect(() => {
    if (currentUser) {
      navigate('/generator');
    }
  }, [currentUser, navigate]);

  const handleSendLink = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      setError('Please enter your email address');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      await sendLoginLink(email);
      setIsLinkSent(true);
      setMessage(`A sign-in link has been sent to ${email}. Please check your email.`);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setError(`Failed to send login link: ${errorMessage}`);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-950 text-white">
      <div className="max-w-md w-full bg-gray-900 p-8 rounded-lg shadow-lg">
        <div className="text-center mb-6">
          <div className="text-4xl mb-4">💎🏃</div>
          <h1 className="text-2xl font-bold text-blue-400">Login to Gem Run</h1>
          <p className="text-gray-300 mt-2">Sign in to access your custom MLB podcasts</p>
        </div>

        {error && (
          <div className="bg-red-900 text-white p-3 rounded mb-4">
            {error}
          </div>
        )}

        {message && (
          <div className="bg-green-900 text-white p-3 rounded mb-4">
            {message}
          </div>
        )}

        {isProcessingLink ? (
          <div className="text-center py-4">
            <div className="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent mx-auto mb-4"></div>
            <p>Processing your sign-in link...</p>
          </div>
        ) : isLinkSent ? (
          <div className="text-center">
            <p className="mb-4">Check your email and click the link we sent to sign in.</p>
            <p className="text-sm text-gray-400">
              If you didn't receive the email, check your spam folder or try again.
            </p>
            <Button
              onClick={() => setIsLinkSent(false)}
              className="mt-4 bg-gray-700 hover:bg-gray-600"
            >
              Try Again
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSendLink} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white"
                placeholder="your.email@example.com"
                required
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin h-4 w-4 border-2 border-white rounded-full border-t-transparent mr-2"></div>
                  Sending Link...
                </div>
              ) : (
                "Send Sign-In Link"
              )}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
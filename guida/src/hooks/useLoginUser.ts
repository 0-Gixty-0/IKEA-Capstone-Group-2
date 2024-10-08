import { useState } from 'react';
import { signIn } from 'next-auth/react';

/**
 * Wrapper hook for signIn in NextAuth. 
 * @returns Redirect to frontpage if successful login. Also sets the users session which can be used to validate 
 * authorization to content on page. 
 * Error if no response or invalid credentials.
 */

export const useLogin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignIn = async (username: string, password: string, redirectUrl = '/') => {
    setLoading(true);
    setError(null);
    
    
    const res = await signIn('credentials', {
      redirect: false, // Prevent automatic redirection
      username,
      password // Credentials: { username, password }
    });

    setLoading(false);
    
    if (res == undefined) {
      setError("something went wrong")
    } else {
    if (res.error) {
      // Handle errors like invalid credentials
      setError(res.error);
    } else {
      // Optional: Redirect user after successful sign-in
      window.location.href = redirectUrl; 
    }
  }
  };

  return {
    handleSignIn,
    loading,
    error,
  };
};
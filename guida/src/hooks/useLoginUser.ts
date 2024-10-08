import { useState } from 'react';
import { signIn } from 'next-auth/react';

export const useLogin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSignIn = async (username: string, password: string, redirectUrl = '/') => {
    setLoading(true);
    setError(null);
    console.log('Recieved by handleSignIn are: ' + username + ' ' + password)
    const res = await signIn('credentials', {
      redirect: false, // Prevent automatic redirection
      username,
      password  // Credentials: { username, password }
    });

    setLoading(false);

    if (res.error) {
      // Handle errors like invalid credentials
      setError(res.error);
    } else {
      // Optional: Redirect user after successful sign-in
      window.location.href = redirectUrl;
    }
  };

  return {
    handleSignIn,
    loading,
    error,
  };
};
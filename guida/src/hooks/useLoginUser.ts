import { useState } from 'react';
import {SignInCredentials} from "@/lib/auth-action";

/**
 * Login hook handles signIn of user from form data
 */
export const useLogin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSignIn = async (username: string, password: string, redirectUrl = '/') => {
    setLoading(true);
    setError(null);
    const res = await SignInCredentials({
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
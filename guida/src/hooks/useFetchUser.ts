import { useState } from "react";
import { FetchedUser } from "@/types";

/**
 * Custom hook for fetching a requested user from user id.
 * Returns fetch function, loading state, and error state.
 * Uses standard user GET fetch request.
 */
export const useFetchUser = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUser = async (id: number): Promise<FetchedUser | null> => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/user?id=${id}`);
      if (!response.ok) throw new Error("Failed to fetch user");
      return await response.json();
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An unknown error occurred");
      }
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { fetchUser, loading, error };
};

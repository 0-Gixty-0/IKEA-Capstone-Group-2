import { useState, useEffect, useRef } from "react";
import { Post, FetchPostsParams } from "../types/index"; // Adjust the import path as needed

/**
 * Custom hook to fetch posts based on provided parameters.
 *
 * @param {string} apiUrl - The API URL to fetch posts from.
 * @param {FetchPostsParams} [params] - Parameters to filter the posts.
 * @returns {{ posts: Post[], loading: boolean, error: string | null }} - The fetched posts, loading state, and error message.
 */
export const useFetchPosts = (apiUrl: string, params?: FetchPostsParams) => {
  // State to store fetched posts
  const [posts, setPosts] = useState<Post[]>([]);
  // State to manage loading state
  const [loading, setLoading] = useState(true);
  // State to store any error messages
  const [error, setError] = useState<string | null>(null);
  // Ref to store previous parameters
  const prevParamsRef = useRef<FetchPostsParams | undefined>(undefined);
  // Ref to track initial load
  const initialLoadRef = useRef(true);

  useEffect(() => {
    // Check if the parameters have changed
    if (
      !initialLoadRef.current &&
      JSON.stringify(prevParamsRef.current) === JSON.stringify(params)
    ) {
      return;
    }

    /**
     * Function to fetch posts.
     * @returns {Promise<void>}
     */
    const fetchPosts = async () => {
      setLoading(true);
      setError(null);

      try {
        const query = new URLSearchParams();
        if (params?.id) query.append("id", params.id.toString());
        if (params?.authorId)
          query.append("authorId", params.authorId.toString());
        if (params?.assignerId)
          query.append("assignerId", params.assignerId.toString());
        if (params?.published !== undefined)
          query.append("published", params.published.toString());

        const response = await fetch(`${apiUrl}?${query.toString()}`);
        if (!response.ok) throw new Error("Failed to fetch posts");

        const data = await response.json();
        setPosts(data.posts || []);
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError("An unknown error occurred");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
    prevParamsRef.current = params; // Update the ref with the current parameters
    initialLoadRef.current = false; // Mark initial load as complete
  }, [apiUrl, params]);

  return { posts, loading, error };
};

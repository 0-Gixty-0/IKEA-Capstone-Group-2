// hooks/useSubmitPost.ts
import { useState } from "react";
import { Post, SubmittablePost } from "@/types";

interface PostResult {
  message: string;
  post: Post;
}

/**
 * Custom hook used for submitting posts.
 * * If post id is provided api method is set as PUT, updating post with passed post data.
 * * If post id is not provided api method is set as POST, creating a new post with passed post data
 * Returns hook, loading status, error status, and success status
 */
export const useSubmitPost = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean | null>(null);
  const [result, setResult] = useState<PostResult | null>(null);

  const submitPost = async (post: SubmittablePost): Promise<void> => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    console.log("in useSubmitPost" + JSON.stringify(post));
    try {
      const response = await fetch("/api/posts", {
        method: post.id ? "PUT" : "POST", // Use PUT if updating, POST if creating
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(post),
      });

      if (!response.ok) {
        throw new Error("Failed to submit post");
      }

      const responseResult = await response.json();
      console.log(responseResult);
      setSuccess(true);
      setResult(responseResult);
    } catch (err) {
      console.error(err);
      setError(post.id ? "Failed to update post" : "Failed to create post");
      setSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  return { submitPost, loading, error, success, result };
};

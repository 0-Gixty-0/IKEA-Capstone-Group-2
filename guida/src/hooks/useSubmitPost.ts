// hooks/useSubmitPost.ts
import { useState } from "react";
import {SubmittablePost} from "@/types";
export const useSubmitPost = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const submitPost = async (post: SubmittablePost): Promise<void> => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch('/api/posts', {
                method: post.id ? 'PUT' : 'POST', // Use PUT if updating, POST if creating
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(post),
            });

            if (!response.ok) {
                throw new Error('Failed to submit post');
            }

            const result = await response.json();
            alert(post.id ? 'Post updated successfully!' : 'Post created successfully!');
        } catch (err) {
            console.error(err);
            setError(post.id ? 'Failed to update post' : 'Failed to create post');
        } finally {
            setLoading(false);
        }
    };

    return { submitPost, loading, error };
};

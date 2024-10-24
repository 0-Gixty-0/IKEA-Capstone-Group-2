import { useState } from "react";

export const useAddToReadingList = (postId: number, onClose: () => void) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAddToReadingList = async (selectedRoles: number[]) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/posts`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ postId, roles: selectedRoles }),
      });

      if (!response.ok) {
        throw new Error("Failed to add post to reading list");
      }

      onClose(); // Close the modal after successful addition
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

  return { loading, error, handleAddToReadingList };
};
// guida/src/hooks/useFetchRoles.ts
import { useState, useEffect } from "react";

export interface Tag {
  id: string;
  name: string;
}

export const useFetchTags = () => {
  const [tags, setTags] = useState<{ label: string; value: string }[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await fetch("/api/tags");
        const data = await response.json();
        const tagOptions = data.tags.map((tag: Tag) => ({
          label: tag.name,
          value: tag.id,
        }));
        setTags(tagOptions);
      } catch (error) {
        setError("Failed to fetch tags");
        console.error("Failed to fetch tags:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTags();
  }, []);

  return { tags, loading, error };
};

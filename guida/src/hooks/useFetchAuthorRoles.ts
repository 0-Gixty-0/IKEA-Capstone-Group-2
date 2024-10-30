import { Post } from "@/types";
import { useEffect, useState } from "react";
import { Role } from "./useFetchRoles";

export function useFetchAuthorRoles(authorId: number | undefined) {
  const [roles, setRoles] = useState<{ label: string; value: string }[]>([]);
  const [error, setError] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setLoading(true);
    async function fetchRoles() {
      try {
        const response = await fetch(`/api/user?id=${authorId}`);
        const data = await response.json();
        setRoles(
          data.roles.map((role: Role) => ({
            label: role.name,
            value: role.id,
          })),
        );
      } catch (error) {
        console.error("Error fetching user's roles:", error);
        setError("Error fetching user's roles");
      }
    }
    fetchRoles();
    setLoading(false);
  }, []);

  return { roles, loading, error };
}

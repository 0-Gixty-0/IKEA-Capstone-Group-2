// guida/src/hooks/useFetchRoles.ts
import { useState, useEffect } from "react";

export interface Role {
  id: string;
  name: string;
}

export const useFetchRoles = () => {
  const [roles, setRoles] = useState<{ label: string; value: string }[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await fetch('/api/roles');
        const data = await response.json();
        const roleOptions = data.roles.map((role: Role) => ({
          label: role.name,
          value: role.id,
        }));
        setRoles(roleOptions);
      } catch (error) {
        setError("Failed to fetch roles");
        console.error("Failed to fetch roles:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRoles();
  }, []);

  return { roles, loading, error };
};
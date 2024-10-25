import {useEffect, useState} from "react";
import {User} from "next-auth";

type Stats = {
    totalAssigned: number;
    numRead: number;
    readUsers: User[];
    nonReadUsers: User[];
}

export const usePostStats = (postId: number) => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [stats, setStats] = useState<Stats | null>(null)

    useEffect(() => {
        setLoading(true)
        const createStats = async () => {
            try {
                const rolesResponse = await fetch(`/api/posts?id=${postId}&includeRoles=true`)
                if (!rolesResponse.ok) throw new Error("Failed to fetch roles for post");
                const rolesData = await rolesResponse.json()

                const response = await fetch(`/api/readingList/?postId=${postId}&roles=${rolesData.roles}`);
                if (!response.ok) throw new Error("Failed to fetch stats");
                const data = await response.json();
                const statsObject: Stats = {
                    nonReadUsers: data.nonReadUsers,
                    numRead: data.numRead,
                    readUsers: data.readUsers,
                    totalAssigned: data.totalAssigned
                }
                setStats(statsObject)
            } catch (error) {
                if (error instanceof Error) {
                    setError(error.message);
                } else {
                    setError("An unknown error occurred");
                }
            } finally {
                setLoading(false)
            }
        }
        createStats()
    }, []);

    return {stats, loading, error}
}
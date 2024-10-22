import {useState} from "react";
import {FetchedUser} from "@/types";

export const useFetchUser = (id: number) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchUser = async (id : number) : Promise<FetchedUser | null> => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`/api/user?id=${id}`)
            if (!response.ok) throw new Error("Failed to fetch user");
            const data = await response.json();
            return data
        } catch (error) {
            if (error instanceof Error) {
                setError((error.message))
            } else {
                setError("An unknown error occurred")
            }
            return null
        } finally {
            setLoading(false)
        }
    }

    return { fetchUser, loading, error}
}
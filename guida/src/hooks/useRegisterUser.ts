import {useState} from "react";
import {SubmittableUser} from "@/types";
import bcrypt from "bcryptjs";

export const useRegisterUser = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<boolean | null>(null)

    const registerUser = async (user: SubmittableUser): Promise<void> => {
        setLoading(true);
        setError(null);
        setSuccess(null);

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);

        try {
            const response = await fetch('/api/user', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(user)
            })

            if (!response.ok) {
                throw new Error('Failed to register user')
            }

            const result = await response.json();
            alert('User registered successfully!')
        } catch (err) {
            console.error(err)
            setError('Failed to register user')
            setSuccess(false)
        } finally {
            setLoading(false)
        }
    }

    return { registerUser, loading, error, success };
}
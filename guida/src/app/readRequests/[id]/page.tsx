'use client'
import {useSession} from "next-auth/react";
import AccessError from "@/app/components/AccessError/AccessError";

export default function ({params}: { params: { id: string } }) {
    const { id } = params
    const session = useSession()

    if (session && session.data?.user?.id === id) {
        return (
            <div>
                <h1>Access granted</h1>
            </div>
        )
    } else {
        return (
                <AccessError message={"You do not have acess to this page"}></AccessError>
            )
    }
}
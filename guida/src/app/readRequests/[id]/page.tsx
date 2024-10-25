'use client'
import {useSession} from "next-auth/react";
import AccessError from "@/app/components/AccessError/AccessError";
import ProfileColumn from "@/app/components/ProfileColumn/ProfileColumn";
import React, {useState} from "react";
import SignOutModal from "@/app/components/SignOutModal/SignOutModal";
import styles from './styles.module.css'

export default function ({params}: { params: { id: string } }) {
    const { id } = params
    const session = useSession()
    const [showSignOut, setShowSignOut] = useState<boolean>(false)

    if (session && session.data?.user?.id === id) {
        return (
            <div className={styles.container}>
                {showSignOut && <SignOutModal onClose={() => {
                    setShowSignOut(false)
                }}/>}
                <ProfileColumn
                    userData={session.data.user}
                    isAuthUser={true}
                    setShowSignOut={setShowSignOut}></ProfileColumn>
            </div>
        )
    } else {
        return (
                <AccessError message={"You do not have access to this page"}></AccessError>
            )
    }
}
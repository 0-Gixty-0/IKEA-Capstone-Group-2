'use client'

import styles from './styles.module.css'
import {useRouter} from "next/navigation";
import {useSession} from "next-auth/react";

/**
 * Header component.
 * Contains:
 * * Title of application "GUIDA"
 * * Button to access homepage
 * * Button to access profile page
 * Is hidden from user if not logged in
 * @constructor
 */
export default function Header() {
    const router = useRouter()
    const session = useSession()

    /**
     * Handler for safety ensuring must be logged in to access profile page
     */
    const handleProfileClick = () => {
        if (session && session.data) {
            router.push(`/profile/${session.data.user.id}`)
        } else {
            router.push('/login')
        }
    }

    if (session.status === "authenticated") {
        return (
            <div className={styles.container}>
                <h1>GUIDA</h1>
                <div className={styles.iconContainer}>
                    <div className={styles.iconContent} onClick={handleProfileClick}>
                        <img src={"/icons/user_icon.png"} alt={'Silhouette of a person'}/>
                    </div>
                    <div className={styles.iconContent} onClick={() => {router.push('/')}}>
                        <img src={"/icons/home_icon.png"} alt={'Silhouette of a house'}/>
                    </div>
                </div>
            </div>
        )
    }
}
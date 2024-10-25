import styles from "./styles.module.css";
import React, {useEffect, useState} from "react";
import {FetchedUser} from "@/types";
import {User} from "next-auth";
import {useSession} from "next-auth/react";
import Preloader from "@/app/components/Preloader/Preloader";
import ProfilePicture from "../ProfilePicture/ProfilePicture";

/**
 * Props contains:
 * * userData: data on user to display
 * * isAuthUser: true if userData is for authenticated user
 * * setShowSignOut: callback function to show sign-out modal
 */
interface ProfileColumnProps {
    userData: FetchedUser | User
    isAuthUser: boolean,
    setShowSignOut: (arg0: boolean) => void
}

/**
 * User profile column. Displays information on a user:
 * * Profile picture
 * * Name
 * * Username
 * * Email
 * * Roles
 * * Groups
 * Also displays sign-out button and edit-profile button if authenticated user.
 * Contains check that passed userData is for authenticated user if isAuthorUser set to true.
 * If isAuthUser set to true and userData not for authenticated user display error.
 * @param userData
 * @param isAuthUser
 * @param setShowSignOut
 * @constructor
 */
export default function ProfileColumn({userData, isAuthUser, setShowSignOut} : ProfileColumnProps) {
    const session = useSession()
    const [correctAuth, setCorrectAuth] = useState<boolean | null>(null)
    const [loadingSession, setLoadingSession] = useState<boolean>(true)

    /**
     * Checks that authenticated session matches userData
     * when isAuthUser set to true
     */
    useEffect(() => {
        if (session.status === 'authenticated' && session.data) {
            if (isAuthUser) {
                if (session.data.user.id === userData.id) {
                    setCorrectAuth(true)
                } else {
                    setCorrectAuth(false)
                }
            } else {
                setCorrectAuth(true)
            }
            setLoadingSession(false)
        }
    }, [session]);
    if (correctAuth && !loadingSession) {
        return (
            <div className={styles.profileContainer}>
                <div className={styles.basicInfoContainer}>
                    {userData.profilePicture && <ProfilePicture imageUrl={userData.profilePicture}/>}
                    <div>
                        <h2>{userData.name}</h2>
                        <h3 id={styles.grayText}>{userData.username}</h3>
                    </div>
                    {/*TODO: Add edit for profile*/}
                    {isAuthUser && <button className={styles.actionButton}>Edit Profile</button>}
                    <hr/>
                </div>
                <div className={styles.infoContainer}>
                    <div>
                        <h2>Contact:</h2>
                        <h3 id={styles.grayText}>{userData.email}</h3>
                    </div>
                    <div>
                        <h2>Roles:</h2>
                        <ul>
                            {userData.roles.map((role, index) => {
                                if (typeof role === 'string') {
                                    return (<li id={styles.grayText} key={index}>{role}</li>)
                                } else {
                                    const roleObject = role as { id: number, name: string }
                                    return (<li id={styles.grayText} key={index}>{roleObject.name}</li>)
                                }
                            })}
                        </ul>
                    </div>
                    <div>
                        <h2>Groups:</h2>
                    </div>
                </div>
                <hr/>
                {isAuthUser && <button
                    className={styles.actionButton}
                    onClick={() => {
                        setShowSignOut(true)
                    }}>
                    Sign Out
                </button>}
            </div>
        )
    } else if (loadingSession) {
        return (
            <div className={styles.preloaderContainer}>
                <Preloader></Preloader>
            </div>
        )
    } else {
        return (
            <div className={styles.profileContainer}>
                <h2>Error!</h2>
                <h3>Authenticated userId does not match userData!</h3>
            </div>
        )
    }
}
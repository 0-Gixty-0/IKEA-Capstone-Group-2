'use client'

import styles from './styles.module.css'
import {useSession} from "next-auth/react";
import {auth} from "@/auth";
import AccessError from "@/app/components/AccessError/AccessError";
import SignOutModal from "@/app/components/SignOutModal/SignOutModal";

export default function Profile() {
    const session = useSession();

    if (session && session.data && session.data.user) {
        const userData = session.data.user

        return (
            <div className={styles.container}>
                {/*{JSON.stringify(userData)}*/}
                <div className={styles.profileContainer}>
                    <div className={styles.basicInfoContainer}>
                        <div className={styles.profilePicture}></div>
                        <div>
                            <h2>{userData.name}</h2>
                            <h3 id={styles.grayText}>{userData.username}</h3>
                        </div>
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
                                {userData.roles.map((role, index) => (
                                    <li id={styles.grayText} key={index}>{role}</li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <h2>Groups:</h2>
                        </div>
                    </div>
                </div>
                <div className={styles.feedContainer}>
                    <div>
                        <h2>Test</h2>
                    </div>
                    <div>

                    </div>
                </div>
            </div>
        )
    } else {
        return (
            <AccessError message={"You must be logged in to view this content"}></AccessError>
        )
    }
}
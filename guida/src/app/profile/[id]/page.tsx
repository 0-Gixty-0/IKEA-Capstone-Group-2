'use client'

import styles from './styles.module.css'
import React, {useEffect, useState} from "react";
import SignOutModal from "@/app/components/SignOutModal/SignOutModal";
import Preloader from "@/app/components/Preloader/Preloader";
import {useFetchPosts} from "@/hooks/useFetchPosts";
import {useSession} from "next-auth/react";
import {FetchedUser} from "@/types";
import {User} from "next-auth";
import {useFetchUser} from "@/hooks/useFetchUser";
import AccessError from "@/app/components/AccessError/AccessError";
import Feed from "@/app/components/Feed/Feed";
import ProfileColumn from "@/app/components/ProfileColumn/ProfileColumn";

/**
 * Profile page.
 * Profile page displays profile picture, name, username, email, roles, and groups for a user.
 * It also contains two feeds for displaying authored (published) posts and authored (draft) posts for a user.
 * If the requested user page is the authenticated user also displays a sign-out and edit-profile button
 * @param params user id to display. Gotten from query
 * @constructor
 */
export default function Profile({ params }: { params: { id: string } }) {
    const { id } = params;
    const session = useSession()
    const [userData, setUserData] = useState<FetchedUser | User | null>(null)
    const [loadingUserData, setLoadingUserData] = useState<boolean>(true)
    const [isAuthUser, setIsAuthUser] = useState<boolean>(false)
    const [showSignOut, setShowSignOut] = useState<boolean>(false)
    const { posts: authoredPosts, loading: loadingAuthoredPosts, error: authoredPostsError } =
        useFetchPosts('/api/posts', {authorId: Number(id), published: true})
    const { posts: draftPosts, loading: loadingDraftPosts, error: draftPostsError } =
        useFetchPosts('/api/posts', {authorId: Number(id), published: false})
    const { fetchUser, loading, error } = useFetchUser();

    /**
     * Sets user data based on if requested profile for user is authenticated.
     * If authenticated uses session data and sets auth user to true.
     * Else fetches user data and sets auth user to false
     */
    useEffect(() => {
        const runEffect = async () => {
            if (session.status === "authenticated" && session.data) {
                if (session && session.data.user.id === id) {
                    setUserData(session.data.user);
                    setIsAuthUser(true);
                } else {
                    fetchUser(Number(id)).then((result) => {
                        if (result) {
                            setUserData(result);
                            setIsAuthUser(false);
                        }
                    })
                }
                setLoadingUserData(false)
            } else {
                return
            }
        }

        runEffect()
    }, [session]);

    /**
     * Displays preloader if user not fetched.
     * Otherwise, displays profile page.
     */
    if (!loadingUserData && userData) {
        return (
            <div className={styles.container}>
                {showSignOut && <SignOutModal onClose={() => {
                    setShowSignOut(false)
                }}/>}
                <ProfileColumn
                    userData={userData}
                    isAuthUser={isAuthUser}
                    setShowSignOut={setShowSignOut}>
                </ProfileColumn>
                <div className={styles.feedContainer}>
                    <Feed
                        title={"Authored Posts"}
                        loadingPosts={loadingAuthoredPosts}
                        error={authoredPostsError}
                        posts={authoredPosts}
                        emptyMessage={"You don't have any public posts!"}>
                    </Feed>
                    <Feed
                        title={"Drafted Posts"}
                        loadingPosts={loadingDraftPosts}
                        error={draftPostsError}
                        posts={draftPosts}
                        emptyMessage={"You don't have any drafted posts!"}>
                    </Feed>
                </div>
            </div>
        )
    /**
     * Generic error modal if user was unable to be fetched.
     */
    } else if (error && !loading) {
        return (
            <AccessError message={error}></AccessError>
        )
    } else {
        return (
            <div className={styles.preloaderContainer}>
                <Preloader></Preloader>
            </div>
        )
    }
}
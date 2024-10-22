'use client'

import styles from './styles.module.css'
import React, {useEffect, useState} from "react";
import SignOutModal from "@/app/components/SignOutModal/SignOutModal";
import PostList from "@/app/components/PostList/PostList";
import SkeletonList from "@/app/components/SkeletonList/SkeletonList";
import Preloader from "@/app/components/Preloader/Preloader";
import {useFetchPosts} from "@/hooks/useFetchPosts";
import {useSession} from "next-auth/react";
import {FetchedUser} from "@/types";
import {User} from "next-auth";
import {useFetchUser} from "@/hooks/useFetchUser";
import AccessError from "@/app/components/AccessError/AccessError";

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
        useFetchPosts({authorId: Number(id), published: true})
    const { posts: draftPosts, loading: loadingDraftPosts, error: draftPostsError } =
        useFetchPosts({authorId: Number(id), published: false})
    const { fetchUser, loading, error } = useFetchUser(Number(id));

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
                <div className={styles.profileContainer}>
                    <div className={styles.basicInfoContainer}>
                        <div className={styles.profilePicture}></div>
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
                <div className={styles.feedContainer}>
                    <div>
                        <h2 id={styles.feedTitle}>Authored Posts</h2>
                        {loadingAuthoredPosts
                            ? (<SkeletonList></SkeletonList>)
                            : (authoredPosts && authoredPosts.length > 0)
                                ? (<PostList posts={authoredPosts} handlePostClick={() => {
                                }}></PostList>)
                                : (<h3 id={styles.emptyMessage}>You haven't authored any posts!</h3>)}
                    </div>
                    <div>
                        <h2 id={styles.feedTitle}>Drafted Posts</h2>
                        {loadingDraftPosts
                            ? (<SkeletonList></SkeletonList>)
                            : (draftPosts && draftPosts.length > 0)
                                ? (<PostList posts={draftPosts} handlePostClick={() => {
                                }}></PostList>)
                                : (<h3 id={styles.emptyMessage}>You don't have any drafted posts!</h3>)}
                    </div>
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
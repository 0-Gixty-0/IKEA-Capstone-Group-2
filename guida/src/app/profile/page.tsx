'use client'

import styles from './styles.module.css'
import {useSession} from "next-auth/react";
import AccessError from "@/app/components/AccessError/AccessError";
import React, {useState} from "react";
import SignOutModal from "@/app/components/SignOutModal/SignOutModal";
import PostList from "@/app/components/PostList/PostList";
import {useFetchPosts} from "@/hooks/useFetchPosts";
import SkeletonList from "@/app/components/SkeletonList/SkeletonList";

export default function Profile() {
    const session = useSession();
    const [showSignOut, setShowSignOut] = useState<boolean>(false)

    if (session && session.data && session.data.user) {
        const userData = session.data.user
        const { posts: authoredPosts, loading: loadingAuthored, error: errorAuthored } = useFetchPosts({
            authorId: Number(userData.id),
            published: true,
        });

        // Fetch drafted posts (assuming you need a different param, like a status)
        const { posts: draftedPosts, loading: loadingDrafted, error: errorDrafted } = useFetchPosts({
            authorId: Number(userData.id),
            published: false, // Example: different param for drafts
        });

        return (
            <div className={styles.container}>
                {showSignOut && <SignOutModal onClose={() => {setShowSignOut(false)}}/>}
                <div className={styles.profileContainer}>
                    <div className={styles.basicInfoContainer}>
                        <div className={styles.profilePicture}></div>
                        <div>
                            <h2>{userData.name}</h2>
                            <h3 id={styles.grayText}>{userData.username}</h3>
                        </div>
                        <button className={styles.actionButton}>Edit Profile</button>
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
                    <hr/>
                    <button
                        className={styles.actionButton}
                        onClick={() => {setShowSignOut(true)}}>
                        Sign Out
                    </button>
                </div>
                <div className={styles.feedContainer}>
                    <div>
                        <h2 id={styles.feedTitle}>Authored Posts</h2>
                        {loadingAuthored
                            ? (<SkeletonList></SkeletonList>)
                            : authoredPosts.length === 0
                                ? (<h3 id={styles.emptyMessage}>You haven't authored any posts!</h3>)
                                : (<PostList posts={authoredPosts} handlePostClick={() => {
                                }}></PostList>)}
                    </div>
                    <div>
                        <h2 id={styles.feedTitle}>Drafted Posts</h2>
                        {loadingDrafted
                            ? (<SkeletonList></SkeletonList>)
                            : authoredPosts.length === 0
                                ? (<h3 id={styles.emptyMessage}>You have no drafted posts!</h3>)
                                : (<PostList posts={draftedPosts} handlePostClick={() => {
                                }}></PostList>)}
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
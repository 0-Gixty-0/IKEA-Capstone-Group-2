'use client'
import {useSession} from "next-auth/react";
import AccessError from "@/app/components/AccessError/AccessError";
import ProfileColumn from "@/app/components/ProfileColumn/ProfileColumn";
import React, {useState} from "react";
import SignOutModal from "@/app/components/SignOutModal/SignOutModal";
import styles from './styles.module.css'
import Feed from "@/app/components/Feed/Feed";
import {useFetchPosts} from "@/hooks/useFetchPosts";
import SkeletonList from "@/app/components/SkeletonList/SkeletonList";

export default function ({params}: { params: { id: string } }) {
    const { id } = params
    const session = useSession()
    const [showSignOut, setShowSignOut] = useState<boolean>(false)
    const { posts: authoredPosts, loading: loadingAuthoredPosts, error: authoredPostsError } =
        useFetchPosts('/api/posts', {published: true, assignerId:Number(id)})

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
                    <div className={styles.feedContainer}>
                        {loadingAuthoredPosts
                            ? (<SkeletonList></SkeletonList>)
                            : (<div></div>)
                        }
                    </div>
                    <div className={styles.feedContainer}>
                        <Feed
                            title={"Read Requested Posts"}
                            loadingPosts={loadingAuthoredPosts}
                            error={authoredPostsError}
                            posts={authoredPosts}
                            emptyMessage={"You don't have any public posts!"}>
                        </Feed>
                    </div>
            </div>
        )
    } else {
        return (
                <AccessError message={"You do not have access to this page"}></AccessError>
            )
    }
}
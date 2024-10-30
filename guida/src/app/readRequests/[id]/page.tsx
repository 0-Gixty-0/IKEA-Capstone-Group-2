"use client";
import { useSession } from "next-auth/react";
import AccessError from "@/app/components/AccessError/AccessError";
import ProfileColumn from "@/app/components/ProfileColumn/ProfileColumn";
import React, { useState } from "react";
import SignOutModal from "@/app/components/SignOutModal/SignOutModal";
import styles from "./styles.module.css";
import Feed from "@/app/components/Feed/Feed";
import { useFetchPosts } from "@/hooks/useFetchPosts";
import SkeletonList from "@/app/components/SkeletonList/SkeletonList";
import PostStatsList from "@/app/components/PostStatsList/PostStatsList";

export default function ({ params }: { params: { id: string } }) {
  const { id } = params;
  const session = useSession();
  const [showSignOut, setShowSignOut] = useState<boolean>(false);
  const {
    posts: assignedPosts,
    loading: loadingAssignedPosts,
    error: assignedPostsError,
  } = useFetchPosts("/api/posts", { published: true, assignerId: Number(id) });

  if (session && session.data?.user?.id === id) {
    return (
      <div className={styles.container}>
        {showSignOut && (
          <SignOutModal
            onClose={() => {
              setShowSignOut(false);
            }}
          />
        )}
        <div className={styles.profileColumnContainer}>
          <ProfileColumn
            userData={session.data.user}
            isAuthUser={true}
            setShowSignOut={setShowSignOut}
          ></ProfileColumn>
        </div>
        <div className={styles.statsContainer}>
          <PostStatsList
            posts={assignedPosts}
            title={"Read Requested Posts"}
            loadingPosts={loadingAssignedPosts}
            error={assignedPostsError}
            emptyMessage={"You have not assigned any posts!"}
          ></PostStatsList>
        </div>
      </div>
    );
  } else {
    return (
      <AccessError
        message={"You do not have access to this page"}
      ></AccessError>
    );
  }
}

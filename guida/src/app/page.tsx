"use client";

import React, { useEffect, useState } from "react";
import styles from "./page.module.css";
import PostDetailModal from "@/app/components/PostDetailModal/PostDetailModal";
import PostForm from "@/app/components/PostForm/PostForm";
import PostList from "@/app/components/PostList/PostList";
import SkeletonList from "@/app/components/SkeletonList/SkeletonList";
import { usePostManagement } from "@/hooks/usePostManagement";

const HomePage: React.FC = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const {
    posts,
    loading,
    error,
    clickedPost,
    isEditing,
    isCreating,
    handlePostClick,
    closeModal,
    handlePostDelete,
    handleEditPost,
    handleCreatePost,
    handleSuccess,
  } = usePostManagement();

  if (!isClient) {
    return null; // or a loading spinner
  }

  return (
    <div className={styles.fullScreen}>
      <div className={styles.postContainer}>
        <h1>Feed</h1>
        {error && <div>Error: {error}</div>}
        <button onClick={handleCreatePost}>Create New Post</button>
        {loading ? (
          <SkeletonList />
        ) : posts.length === 0 ? (
          <div>All posts read</div>
        ) : (
          <PostList posts={posts} handlePostClick={handlePostClick} />
        )}
      </div>
      {(clickedPost || isCreating) && (
        <PostDetailModal
          onClose={closeModal}
          postId={clickedPost?.id ?? 0}
          onDelete={handlePostDelete}
        >
          {isEditing || isCreating ? (
            <PostForm
              post={clickedPost || undefined} // Convert null to undefined
              submitText={isCreating ? "Create Post" : "Update Post"}
              onClose={closeModal}
              onSuccess={handleSuccess}
            />
          ) : (
            <>
              {clickedPost && (
                <>
                  <h2>{clickedPost.title}</h2>
                  <p>{clickedPost.content}</p>
                  <button onClick={handleEditPost}>Edit Post</button>
                </>
              )}
            </>
          )}
        </PostDetailModal>
      )}
    </div>
  );
};

export default HomePage;
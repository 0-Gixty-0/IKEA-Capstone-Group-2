"use client";

import React, { useEffect, useState } from "react";
import styles from "./page.module.css";
import Modal from "@/app/components/PostDetailModal/PostDetailModal";
import PostForm from "@/app/components/PostForm/PostForm";
import { usePostManagement } from "@/hooks/usePostManagement";

const HomeScreen: React.FC = () => {
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
          Array.from({ length: 5 }, (_, index) => (
            <li
              key={index}
              className={`${styles.skeleton} ${styles["skeleton-post"]}`}
            ></li>
          ))
        ) : posts.length === 0 ? (
          <div>All posts read</div>
        ) : (
          <ul>
            {posts.map(({ id, title, content, published, authorId }) => (
              <li
                key={id}
                className={styles.post}
                onClick={() =>
                  handlePostClick({ id, title, content, published, authorId })
                }
              >
                <div className={styles.postContent}>
                  <h2>{title}</h2>
                  <p>{content}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
      {(clickedPost || isCreating) && (
        <Modal
          onClose={closeModal}
          postId={clickedPost?.id ?? 0}
          onDelete={handlePostDelete}
        >
          {isEditing || isCreating ? (
            <PostForm
              post={clickedPost || undefined}
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
        </Modal>
      )}
    </div>
  );
};

export default HomeScreen;
"use client";

// Imports
import React, { useState } from "react";
import styles from "./page.module.css";
import { useFetchPosts } from "@/hooks/useFetchPosts";
import Modal from "@/app/components/Modal";

const Home: React.FC = () => {
  const { posts, loading, error } = useFetchPosts(); // Use the custom hook
  const [clickedPost, setClickedPost] = useState<{
    id: number;
    title: string;
    content: string;
  } | null>(null);

  const handlePostClick = (post: {
    id: number;
    title: string;
    content: string;
  }) => {
    setClickedPost(post);
  };

  const closeModal = () => {
    setClickedPost(null);
  };

  const handlePostDelete = async () => {
    closeModal(); // Close the modal
    window.location.reload(); // Refresh the site
  };

  return (
    <div className={styles.fullScreen}>
      <div className={styles.postContainer}>
        <h1>Feed</h1>
        {error && <div>Error: {error}</div>} {/* Display error if any */}
        <ul>
          {loading
            ? Array.from({ length: 5 }, (_, index) => (
                <li
                  key={index}
                  className={`${styles.skeleton} ${styles["skeleton-post"]}`}
                ></li> // Render skeleton loaders while loading
              ))
            : posts.map(({ id, title, content }) => (
                <li
                  key={id}
                  className={styles.post}
                  onClick={() => handlePostClick({ id, title, content })}
                >
                  <div className={styles.postContent}>
                    <h2>{title}</h2>
                    <p>{content}</p>
                  </div>
                </li> // Render posts once they are fetched
              ))}
        </ul>
      </div>
      {clickedPost && (
        <Modal onClose={closeModal} postId={clickedPost.id} onDelete={handlePostDelete}>
          <h2>{clickedPost.title}</h2>
          <p>{clickedPost.content}</p>
        </Modal>
      )}
    </div>
  );
};

export default Home; // Export the Home component as default
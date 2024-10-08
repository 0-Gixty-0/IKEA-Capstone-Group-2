"use client";

// Imports
import React, { useState } from "react";
import styles from "./page.module.css";
import { useFetchPosts } from "@/hooks/useFetchPosts";
import Modal from "@/app/components/Modal";
import PostForm from "@/app/components/PostForm/PostForm"; // Import PostForm
import { Post } from "@/types"; // Adjust this import according to your types

const Home: React.FC = () => {
  const { posts, loading, error } = useFetchPosts(); // Use the custom hook
  const [clickedPost, setClickedPost] = useState<Post | null>(null); // Ensure the type is Post or null
  const [isEditing, setIsEditing] = useState(false); // Track if we're editing

  const handlePostClick = (post: Post) => {
    setClickedPost(post); // Pass the full post object
    setIsEditing(false); // Reset editing state
  };

  const closeModal = () => {
    setClickedPost(null);
    setIsEditing(false); // Reset editing state
  };

  const handlePostDelete = async () => {
    closeModal(); // Close the modal
    window.location.reload(); // Refresh the site
  };

  const handleEditPost = () => {
    setIsEditing(true); // Set editing state to true
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
            : posts.map(({ id, title, content, published, authorId }) => (
                <li
                  key={id}
                  className={styles.post}
                  onClick={() => handlePostClick({ id, title, content, published, authorId })} // Pass complete post
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
        <Modal 
          onClose={closeModal} 
          postId={clickedPost.id} 
          onDelete={handlePostDelete} 
        >
          {isEditing ? (
            <PostForm
              post={clickedPost} // Pass the full clicked post to PostForm
              submitText="Update Post" // Change submit text for editing
              onClose={closeModal} // Close modal on submit
            />
          ) : (
            <>
              <h2>{clickedPost.title}</h2>
              <p>{clickedPost.content}</p>
              <button onClick={handleEditPost}>Edit Post</button> {/* Add Edit button directly */}
            </>
          )}
        </Modal>
      )}
    </div>
  );
};

export default Home; // Export the Home component as default

"use client";

// Imports
import React from "react";
import styles from "./page.module.css";
import { useFetchPosts } from "../hooks/useFetchPosts"; // Adjust the import path as needed

const Home: React.FC = () => {
  const { posts, loading, error } = useFetchPosts(); // Use the custom hook

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
                <li key={id} className={styles.post}>
                  <div className={styles.postContent}>
                    <h2>{title}</h2>
                    <p>{content}</p>
                  </div>
                </li> // Render posts once they are fetched
              ))}
        </ul>
      </div>
    </div>
  );
};

export default Home; // Export the Home component as default

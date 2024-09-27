"use client";

import React, { useState, useEffect } from "react";
import styles from "./page.module.css";

interface Post {
  id: number;
  title: string;
  content: string;
  published: boolean;
  authorId: number;
}

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch("/api/posts");
        if (!response.ok) {
          throw new Error("Failed to fetch posts");
        }
        const data = await response.json();
        setPosts(data.posts || []); // Ensure data.posts is an array
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  return (
    <div className={styles.fullScreen}>
      <div className={styles.postContainer}>
        <h1>Feed</h1>
        <ul>
          {loading
            ? Array.from({ length: posts.map.length + 1 }).map((_, index) => (
                <li
                  key={index}
                  className={`${styles.skeleton} ${styles["skeleton-post"]}`}
                ></li>
              ))
            : posts.map((post) => (
                <li key={post.id} className={styles.post}>
                  <div className={styles.postContent}>
                    <h2>{post.title}</h2>
                    <p>{post.content}</p>
                  </div>
                </li>
              ))}
        </ul>
      </div>
    </div>
  );
}

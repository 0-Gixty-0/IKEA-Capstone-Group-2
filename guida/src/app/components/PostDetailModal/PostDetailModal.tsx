"use client";

import React, { useEffect, useState } from "react";
import styles from "./PostDetailModal.module.css";
import DeleteButton from "../DeleteButton";
import { ModalProps } from "@/types";
import { fetchTagsForPost } from "@/app/util/api"; // Ensure this import points to your API function

const PostDetailModal: React.FC<ModalProps> = ({
  onClose,
  children,
  postId,
  onDelete,
}) => {
  const [tags, setTags] = useState<string[]>([]); // State to hold tag names
  const [loading, setLoading] = useState(true); // State to manage loading status
  const [error, setError] = useState<string | null>(null); // State to manage error messages

  useEffect(() => {
    const fetchTags = async () => {
      setLoading(true); // Set loading to true before fetching
      try {
        // Fetch tags for the given postId
        const fetchedTags = await fetchTagsForPost(postId);
        setTags(fetchedTags.map((tag: { name: string }) => tag.name)); // Assuming 'name' is the string property of 'Tag'
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message); // Set error message if an error occurs
        } else {
          setError("An unknown error occurred");
        }
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    };

    if (postId) {
      fetchTags(); // Call the fetchTags function if postId is defined
    }
  }, [postId]); // Re-run this effect if postId changes

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <DeleteButton postId={postId} onDelete={onDelete} />
        <button className={styles.closeButton} onClick={onClose}>
          &times;
        </button>
        {children}

        {/* Loading and error handling for tags */}
        {loading && <p>Loading tags...</p>}
        {error && <p>Error: {error}</p>}

        {/* Render the tags */}
        {!loading && !error && (
          <div className={styles.tagsContainer}>
            <h3>Tags:</h3>
            {tags.length > 0 ? (
              <ul className={styles.tagsList}>
                {tags.map((tag, index) => (
                  <li key={index} className={styles.tagItem}>
                    {tag}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No Tags</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PostDetailModal;

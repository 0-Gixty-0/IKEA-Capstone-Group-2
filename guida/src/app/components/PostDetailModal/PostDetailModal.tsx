"use client";

import React, {useEffect, useState } from "react";
import styles from "./PostDetailModal.module.css";
import DeleteButton from "../DeleteButton";
import {Post} from "@/types";
import ReadButton from "../ReadButton";
import AddToReadingListModal from "../AddToReadingListModal/AddToReadingListModal";
import { ModalProps } from "@/types";
import PostForm from "@/app/components/PostForm/PostForm";
import PdfReader from "../PdfReader/PdfReader";
import { fetchTagsForPost } from "@/app/util/api";

/**
 * IPostDetailModal contains:
 * * onClose: Close modal callback
 * * post: Post to display detailed view for
 * * onDelete: Callback for deletion of viewed post
 * * onEdit: Callback for edit of viewed post
 * * onRead: Callback for read confirmation of viewed post
 */
export interface IPostDetailModal {
  onClose: () => void;
  post: Post;
  onDelete: (arg0: Post) => void;
  onEdit: (arg0: Post) => void;
  onRead: (arg0: Post) => void;
}

/**
 * PostDetailModal contains a detailed view of supplied post.
 * Contains callback buttons for edit, delete, and read post.
 * @param onClose Close modal callback
 * @param post Post to display detailed view for
 * @param onDelete Callback for deletion of viewed post
 * @param onEdit Callback for edit of viewed post
 * @param onRead Callback for read confirmation of viewed post
 * @constructor
 */
const PostDetailModal = ({onClose, post, onDelete, onEdit, onRead}: IPostDetailModal) => {
    const [showEditPostForm, setShowEditPostForm] = useState<boolean>(false)

    const handleEditClick = () => {
    setShowEditPostForm(true)
    }

    const [isAddToReadingListModalOpen, setIsAddToReadingListModalOpen] = useState(false);

    const handleOpenAddToReadingListModal = () => {
    setIsAddToReadingListModalOpen(true);
    };

    const handleCloseAddToReadingListModal = () => {
    setIsAddToReadingListModalOpen(false);
    };

    const [tags, setTags] = useState<string[]>([]); // State to hold tag names
    const [loading, setLoading] = useState(true); // State to manage loading status
    const [error, setError] = useState<string | null>(null); // State to manage error messages

    useEffect(() => {
        const fetchTags = async () => {
            setLoading(true); // Set loading to true before fetching
            try {
                // Fetch tags for the given postId
                const fetchedTags = await fetchTagsForPost(post.id);
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

        if (post.id) {
            fetchTags(); // Call the fetchTags function if postId is defined
        }
    }, [post.id]); // Re-run

    return (
    <div id={styles.modalOverlay}>
      {isAddToReadingListModalOpen && (
        <AddToReadingListModal
          postId={post.id}
          onClose={handleCloseAddToReadingListModal}
        />
      )}
      {showEditPostForm && <PostForm
              post={post}
              submitText={'Update Post'}
              onClose={() => {setShowEditPostForm(false)}}
              onSuccess={onEdit}/>
      }
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose}>
          &times;
        </button>
        <h2>{post.title}</h2>
        <hr/>
        <h3>Content:</h3>
        <p>{post.content}</p>
        {post.pdfUrl && <PdfReader pdfUrl={post.pdfUrl}/>}
        <div className={styles.buttonContainer}>
          <DeleteButton postId={post.id} onDelete={() => {
            onDelete(post)
          }}/>{" "}
          <button onClick={handleEditClick}>Edit Post</button>
          <ReadButton post={post} onRead={onRead}/>{" "}
          <button onClick={handleOpenAddToReadingListModal}>Add to Reading List</button>
        </div>
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
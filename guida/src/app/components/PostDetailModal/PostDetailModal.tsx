import React, { useState } from "react";
import styles from "./PostDetailModal.module.css";
import DeleteButton from "../DeleteButton";
import {Post} from "@/types";
import ReadButton from "../ReadButton";
import AddToReadingListModal from "../AddToReadingListModal/AddToReadingListModal";
import { ModalProps } from "@/types";
import PostForm from "@/app/components/PostForm/PostForm";

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

  return (
    <div id={styles.modalOverlay}>
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
        <div className={styles.buttonContainer}>
          <DeleteButton postId={post.id} onDelete={() => {
            onDelete(post)
          }}/>{" "}
          <button onClick={handleEditClick}>Edit Post</button>
          <ReadButton post={post} onRead={onRead}/>{" "}
        </div>
      </div>
    </div>
  );
};

export default PostDetailModal;
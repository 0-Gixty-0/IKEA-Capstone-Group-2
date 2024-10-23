import React, {useState} from "react";
import styles from "./PostDetailModal.module.css";
import DeleteButton from "../DeleteButton";
import {Post} from "@/types";
import ReadButton from "../ReadButton";
import PostForm from "@/app/components/PostForm/PostForm";

// Modal-related interfaces
export interface PostDetailModal {
  onClose: () => void;
  children: React.ReactNode;
  post: Post;
  onDelete: (arg0: Post) => void;
  onEdit: () => void;
  onRead: () => void;
}

const PostDetailModal = ({onClose, children, post, onDelete, onEdit, onRead}: PostDetailModal) => {
  const [showEditPostForm, setShowEditPostForm] = useState<boolean>(false)

  const handleEditClick = () => {
    setShowEditPostForm(true)
  }

  return (
    <div id={styles.modalOverlay}>
      {showEditPostForm && <PostForm
              post={post}
              submitText={'Update Post'}
              onClose={() => {setShowEditPostForm(false)}}
              onSuccess={() => {}}/>
      }
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        {/* Pass onDelete to DeleteButton */}
        <button className={styles.closeButton} onClick={onClose}>
          &times;
        </button>
        <ReadButton postId={post.id} onRead={onRead}/>{" "}
        <h2>{post.title}</h2>
        <p>{post.content}</p>
        <DeleteButton postId={post.id} onDelete={() => {onDelete(post)}}/>{" "}
        <button onClick={handleEditClick}>Edit Post</button>
        {children}{" "}
        {/* Display the children passed, which can be PostForm or post details */}
      </div>
    </div>
  );
};

export default PostDetailModal;

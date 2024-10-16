import React from "react";
import styles from "./PostDetailModal.module.css";
import DeleteButton from "../DeleteButton";
import { ModalProps } from "@/types";

const PostDetailModal: React.FC<ModalProps> = ({
  onClose,
  children,
  postId,
  onDelete,
}) => {
  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <DeleteButton postId={postId} onDelete={onDelete} />{" "}
        {/* Pass onDelete to DeleteButton */}
        <button className={styles.closeButton} onClick={onClose}>
          &times;
        </button>
        {children}{" "}
        {/* Display the children passed, which can be PostForm or post details */}
      </div>
    </div>
  );
};

export default PostDetailModal;

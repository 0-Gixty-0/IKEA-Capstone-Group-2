import React from "react";
import styles from "./PostDetailModal.module.css";
import DeleteButton from "../DeleteButton";
import { ModalProps } from "@/types";
import ReadButton from "../ReadButton";

const PostDetailModal: React.FC<ModalProps> = ({
  onClose,
  children,
  postId,
  onDelete,
  onRead,
}) => {
  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose}>
          &times;
        </button>

        <div className={styles.actionButtons}>
          <DeleteButton postId={postId} onDelete={onDelete} className={styles.deleteButton} />
          <ReadButton postId={postId} onRead={onRead} className={styles.readButton} />
        </div>

        {/* Render children such as PostForm or post details */}
        <div className={styles.modalBody}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default PostDetailModal;

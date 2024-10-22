import React, { useState } from "react";
import styles from "./PostDetailModal.module.css";
import DeleteButton from "../DeleteButton";
import ReadButton from "../ReadButton";
import AddToReadingListModal from "../AddToReadingListModal/AddToReadingListModal";
import { ModalProps } from "@/types";

const PostDetailModal: React.FC<ModalProps> = ({
  onClose,
  children,
  postId,
  onDelete,
  onRead,
}) => {
  const [isAddToReadingListModalOpen, setIsAddToReadingListModalOpen] = useState(false);

  const handleOpenAddToReadingListModal = () => {
    setIsAddToReadingListModalOpen(true);
  };

  const handleCloseAddToReadingListModal = () => {
    setIsAddToReadingListModalOpen(false);
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <DeleteButton postId={postId} onDelete={onDelete} />
        <button className={styles.closeButton} onClick={onClose}>
          &times;
        </button>
        <ReadButton postId={postId} onRead={onRead} />
        {children}
        <button
          onClick={handleOpenAddToReadingListModal}
          className={styles.addToReadingListButton}
        >
          Add to Reading List
        </button>
        {isAddToReadingListModalOpen && (
          <AddToReadingListModal
            postId={postId}
            onClose={handleCloseAddToReadingListModal}
          />
        )}
      </div>
    </div>
  );
};

export default PostDetailModal;
import React from "react";
import styles from "./Modal.module.css";
import DeleteButton from "./DeleteButton";

interface ModalProps {
  onClose: () => void;
  children: React.ReactNode;
  postId: number;
  onDelete: () => void; // Add onDelete prop
}

const Modal: React.FC<ModalProps> = ({ onClose, children, postId, onDelete }) => {
  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <DeleteButton postId={postId} onDelete={onDelete} /> {/* Pass onDelete to DeleteButton */}
        <button className={styles.closeButton} onClick={onClose}>
          &times;
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
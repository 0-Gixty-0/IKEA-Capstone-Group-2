import React, { useEffect, useState } from "react";
import styles from "./PostDetailModal.module.css";
import DeleteButton from "../DeleteButton";
import { ModalProps } from "@/types";
import ReadButton from "../ReadButton";
import PdfReader from "../PdfReader/PdfReader";

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
        <DeleteButton postId={postId} onDelete={onDelete} />{" "}
        {/* Pass onDelete to DeleteButton */}
        <button className={styles.closeButton} onClick={onClose}>
          &times;
        </button>
        <ReadButton postId={postId} onRead={onRead} />{" "}
        {children}{" "}
        {/* Display the children passed, which can be PostForm or post details */}
        <PdfReader postId={postId} />
      </div>
    </div>
  );
};

export default PostDetailModal;
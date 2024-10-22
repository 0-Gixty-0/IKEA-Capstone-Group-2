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
        <DeleteButton postId={postId} onDelete={onDelete} />{" "}
        {/* Pass onDelete to DeleteButton */}
        <button className={styles.closeButton} onClick={onClose}>
          &times;
        </button>
        <ReadButton postId={postId} onRead={onRead} />{" "}
        {children}{" "}
        {/* Display the children passed, which can be PostForm or post details */}
        <iframe
          src="https://www.antennahouse.com/hubfs/xsl-fo-sample/pdf/basic-link-1.pdf"
          className={styles.pdfViewer}
          title="Collision PDF"
        />
      </div>
    </div>
  );
};

export default PostDetailModal;

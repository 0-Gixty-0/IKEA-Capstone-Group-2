import React, { useEffect, useState } from "react";
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
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchPostDetails = async () => {
      try {
        const response = await fetch(`/api/posts?id=${postId}`);
        const data = await response.json();
        console.log("Fetched post details:", data); // Log the fetched data
        console.log("pdfUrl");
        console.log(data.post.pdfUrl);
        setPdfUrl(data.post.pdfUrl);
      } catch (error) {
        console.error('Error fetching post details:', error);
      }
    };

    fetchPostDetails();
  }, [postId]);

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
        {pdfUrl ? (
          <iframe
            src={pdfUrl}
            className={styles.pdfViewer}
            title="Post PDF"
          />
        ) : (
          <p></p>
        )}
      </div>
    </div>
  );
};

export default PostDetailModal;
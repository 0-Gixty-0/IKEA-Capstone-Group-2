// guida/src/app/components/PostList/PostList.tsx
import React from "react";
import styles from "./PostItem.module.css";
import { ClickablePostProps } from "@/types";

const PostItem: React.FC<ClickablePostProps> = ({
  id,
  title,
  content,
  published,
  authorId,
  pdfUrl,
  handlePostClick,
}) => {
  return (
    <li
      className={styles.post}
      onClick={() =>
        handlePostClick({ id, title, content, published, authorId, pdfUrl })
      }
    >
      <div className={styles.postContent}>
        <h2>{title}</h2>
        <p>{content}</p>
      </div>
    </li>
  );
};

export default PostItem;
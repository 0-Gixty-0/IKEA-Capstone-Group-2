// guida/src/app/components/PostList/PostList.tsx
import React, { useEffect, useState } from "react";
import styles from "./PostItem.module.css";
import { ClickablePostProps } from "@/types";
import { useAuthorAndRole } from "@/hooks/useAuthorAndRole";

const PostItem: React.FC<ClickablePostProps> = ({
  id,
  title,
  content,
  published,
  authorId,
  roleId,
  handlePostClick,
}) => {
  const [author, role] = useAuthorAndRole(roleId, authorId);

  return (
    <li
      className={styles.post}
      onClick={() =>
        handlePostClick({ id, title, content, published, authorId, roleId })
      }
    >
      <div className={styles.postContent}>
        <h2>{title}</h2>
        <h3>{!role ? author : role}</h3>
        <p>{content}</p>
      </div>
    </li>
  );
};

export default PostItem;
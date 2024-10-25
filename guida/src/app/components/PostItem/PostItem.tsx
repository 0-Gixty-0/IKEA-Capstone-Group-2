// guida/src/app/components/PostList/PostList.tsx
import React, { useEffect, useState } from "react";
import styles from "./PostItem.module.css";
import { ClickablePostProps } from "@/types";
import { useFetchAuthorAndRoleOfPost } from "@/hooks/useFetchAuthorAndRoleOfPost";
import Preloader from "../Preloader/Preloader";

const PostItem: React.FC<ClickablePostProps> = ({
  id,
  title,
  content,
  published,
  authorId,
  pdfUrl,
  tags,
  roleId,
  handlePostClick,
}) => {
  const {authorAndRole: [author, role], loading: authorRoleLoading } = useFetchAuthorAndRoleOfPost(roleId, authorId);

  return (
    <li
      className={styles.post}
      onClick={() =>
        handlePostClick({ id, title, content, published, authorId, pdfUrl, tags, roleId })
      }
    >{authorRoleLoading ? <Preloader /> : 
    <div className={styles.postContent}>
      <h2>{title}</h2>
      <h3>{!role ? author : role}</h3>
      <p>{content}</p>
    </div>}
    </li>
  );
};

export default PostItem;
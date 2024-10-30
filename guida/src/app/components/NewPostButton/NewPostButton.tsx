import { Post } from "@/types";
import { useState } from "react";
import PostForm from "@/app/components/PostForm/PostForm";
import styles from "./styles.module.css";

interface NewPostButtonProps {
  onSuccess: (arg0: Post) => void;
}

/**
 * NewPostButton handles creating a new post through
 * showing the PostForm component.
 * Contains callback for successful creation of a post
 * @param onSuccess Callback method for successful creation of a post
 * @constructor
 */
export default function NewPostButton({ onSuccess }: NewPostButtonProps) {
  const [showPostForm, setShowPostForm] = useState<boolean>(false);

  const handleButtonClick = () => {
    setShowPostForm(true);
  };

  const handleCreateNewPost = (post: Post) => {
    setShowPostForm(false);
    onSuccess(post);
  };

  return (
    <>
      {showPostForm && (
        <PostForm
          submitText={"Create Post"}
          onClose={() => {
            setShowPostForm(false);
          }}
          onSuccess={handleCreateNewPost}
        />
      )}
      <button className={styles.newPostButton} onClick={handleButtonClick}>
        Create New Post!
      </button>
    </>
  );
}

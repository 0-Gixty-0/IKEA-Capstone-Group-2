import React, { useEffect, useState } from "react";
import { Post, SubmittablePost } from "@/types";
import { useSubmitPost } from "@/hooks/useSubmitPost";
import styles from "./styles.module.css";
import Preloader from "@/app/components/Preloader/Preloader";
import { IPostForm } from "@/types";
import TagInput from "@/app/components/TagInput/TagInput";


export default function PostForm(props: IPostForm) {
  const { post, submitText, onClose, onSuccess } = props;
  const { submitPost, loading, error, success, result } = useSubmitPost();
  const [valueError, setValueError] = useState<boolean>(false);
  const [titleError, setTitleError] = useState<boolean>(false);
  const [contentError, setContentError] = useState<boolean>(false);
  const tagoptions = [
    "Management", "Environment", "Guide", "IKEA Family", "Routine",
    "Sustainability", "Tips", "Wellness"
  ];

  const [title, setTitle] = useState<string>(props.post ? props.post.title : "");
  const [content, setContent] = useState<string>(props.post ? props.post.content : "");
  const [published, setPublished] = useState<boolean>(props.post ? props.post.published : false);
  const [tags, setTags] = useState<string[]>(props.post ? props.post.tags : []);  // State for selected tags


  useEffect(() => {
    if (post) {
      setTitle(post.title);
      setContent(post.content);
      setPublished(post.published);
      setTags(post.tags ?? []);  // Initialize with post's existing tags
    }
  }, [post]);

  useEffect(() => {
    if (success && result) {
      onSuccess(result.post);
    }
  }, [success, result, onSuccess]);

  const handleSelectChange = (targetValue: string) => {
    const value = targetValue === "true"; // Convert string to boolean
    setPublished(value); // Update the state
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (title === "") {
      setTitleError(true);
      setValueError(true);
    }
    if (content === "") {
      setContentError(true);
      setValueError(true);
    }

    if (title !== "" && content !== "") {
      const postToSubmit: SubmittablePost = {
        id: post?.id || null,
        title,
        content,
        authorId: post?.authorId || null,
        published,
        tags,  // Use the updated tags array
      };

      submitPost(postToSubmit);
    }
  };

  return (
    <div className={styles.postFormOverlay}>
      <div className={styles.postFormContent}>
        <button className={styles.closeButton} onClick={onClose}>
          &times;
        </button>
        <h2>{submitText}</h2>
        <hr />
        <form onSubmit={onSubmit}>
          <div className={styles.postFormElement}>
            <label>* Title:</label>
            <input
              className={titleError ? styles.errorBorder : ""}
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                setTitleError(false);
                setValueError(false);
              }}
            />
          </div>
          <div className={styles.postFormElement}>
            <label>* Content:</label>
            <textarea
              className={contentError ? styles.errorBorder : ""}
              value={content}
              onChange={(e) => {
                setContent(e.target.value);
                setContentError(false);
                setValueError(false);
              }}
            />
          </div>
          <div className={styles.postFormContent}>
            <label>* Tags</label>
            <TagInput
              formFieldName={"Tags"}
              options={tagoptions}
              onChange={(selectedTags: string[]) => setTags(selectedTags)}  // Update the tags state
            />
          </div>
          <div className={styles.postFormElement}>
            <label>Published:</label>
            <select
              value={published ? "true" : "false"}
              onChange={(e) => handleSelectChange(e.target.value)}
            >
              <option value={"true"}>True</option>
              <option value={"false"}>False</option>
            </select>
          </div>
          <button className={styles.submitButton} type="submit">
            {submitText}
          </button>
        </form>
        {loading && <Preloader />}
        {valueError && (
          <p className={styles.errorMessage}>Required fields are missing!</p>
        )}
        {error && <p className={styles.errorMessage}>{error}</p>}
      </div>
    </div>
  );
}

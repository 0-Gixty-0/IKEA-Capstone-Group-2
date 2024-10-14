import React, {useEffect, useState} from "react";
import {Post, SubmittablePost} from "@/types";
import {useSubmitPost} from "@/hooks/useSubmitPost";
import styles from "./styles.module.css"
import Preloader from "@/app/components/Preloader/Preloader";

/**
 * PostForm props consists of:
 * * post: Passed post to edit. Optional, if provided edits post, otherwise creates new post
 * * submitText: Text representing action. Should be one of "Update Post" or "Create Post" as needed
 * * OnClose: callback function called on successful submit
 */
interface IPostForm {
  post?: Post;
  submitText: string;
  onClose: () => void;
  onSuccess: (post: Post) => void;
}

/**
 * PostForm modal consists of form for creating a new post or updating existing post.
 * Modal covers entire screen and prohibits user actions outside the modal.
 * Passing post to PostForm puts the form into edit mode, otherwise create mode.
 * @param props
 * @constructor
 */
export default function PostForm(props: IPostForm) {
  const { post, submitText, onClose, onSuccess } = props;
  const { submitPost, loading, error, success, result } = useSubmitPost();
  const [valueError, setValueError] = useState<boolean>(false);
  const [titleError, setTitleError] = useState<boolean>(false);
  const [contentError, setContentError] = useState<boolean>(false);
  const [title, setTitle] = useState<string>(
    props.post ? props.post.title : "",
  );
  const [content, setContent] = useState<string>(
    props.post ? props.post.content : "",
  );
  const [published, setPublished] = useState<boolean>(
    props.post ? props.post.published : false,
  );

  /**
   * Updates post state when provided
   */
  useEffect(() => {
    if (post) {
      setTitle(post.title);
      setContent(post.content);
      setPublished(post.published);
    }
  }, [post]);

  /**
   * Calls callback function onClose upon successful submit
   */
  useEffect(() => {
    if (success && result) {
      onSuccess(result.post);
    }
  }, [success]);

  const handleSelectChange = (targetValue: string) => {
    const value = targetValue === "true"; // Convert string to boolean
    setPublished(value); // Update the state
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
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
        authorId: post?.authorId || 1, // TODO: MODIFY TO INCLUDE NEW POST FOR LOGGED IN USER
        published,
      };

      submitPost(postToSubmit);
    }
  };

  /**
   * Validates that title and content have been filled out. If not sets valueError state to true displaying
   * error message and sets input border to error state respectively.
   * If validation passes creates a submittable post object and attempts to submit
   * constructed post from form data.
   * @param e
   */
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

        if (title !== '' && content !== '') {
            const postToSubmit: SubmittablePost = {
                id: post?.id || null,
                title,
                content,
                authorId: post?.authorId || null,
                published,
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
                <hr/>
                <form onSubmit={onSubmit}>
                    <div className={styles.postFormElement}>
                        <label>
                            * Title:
                        </label>
                        <input
                            className={titleError ? styles.errorBorder : ''}
                            type="text"
                            value={title}
                            onChange={(e) => {
                                setTitle(e.target.value)
                                setTitleError(false);
                                setValueError(false)
                            }}
                        />
                    </div>
                    <div className={styles.postFormElement}>
                        <label>
                            * Content:
                        </label>
                        <textarea
                            className={contentError ? styles.errorBorder : ''}
                            value={content}
                            onChange={(e) => {
                                setContent(e.target.value)
                                setContentError(false)
                                setValueError(false)
                            }}
                        />
                    </div>
                    <div className={styles.postFormElement}>
                        <label>
                            Published:
                        </label>
                        <select
                            value={published ? 'true' : 'false'} // ...force the select's value to match the state variable...
                            onChange={e => handleSelectChange(e.target.value)} // ... and update the state variable on any change!
                        >
                            <option value={"true"}>True</option>
                            <option value={"false"}>False</option>
                        </select>
                    </div>
                    <button className={styles.submitButton} type="submit">{submitText}</button>
                </form>
                {loading && <Preloader/>}
                {valueError && <p className={styles.errorMessage}>Required fields are missing!</p>}
                {error && <p className={styles.errorMessage}>{error}</p>}
            </div>
        </div>
    )
}

import React, { useEffect, useState } from "react";
import { Post, SubmittablePost } from "@/types";
import { useSubmitPost } from "@/hooks/useSubmitPost";
import styles from "./styles.module.css";
import Preloader from "@/app/components/Preloader/Preloader";
import { IPostForm } from "@/types";
import { useSession } from "next-auth/react";


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
  
  const [roleName, setRoleName] = useState<string>("");
  
  var roleId = props.post ? props.post.roleId : null;
    // Fetch role name based on roleId
  useEffect(() => {
    async function fetchRoleName() {
      if (roleId) {
        try {
          const response = await fetch(`/api/roles?id=${roleId}`);
          const data = await response.json();
          setRoleName(data.role.name); // Set the fetched role name
        } catch (error) {
          console.error("Error fetching role name:", error);
        }
      } else {
        setRoleName("none");
      }
    }
    fetchRoleName(); // Call the fetch function on component mount or roleId change
  }, [roleId]); // Only re-run if roleId changes

  useEffect(() => {
    console.log(roleName)
  }, [roleName])

  useEffect(() => {
    if (post) {
      setTitle(post.title);
      setContent(post.content);
      setPublished(post.published);
    }
  }, [post]);
  const session = useSession().data
  const userRoles = session?.user?.roles || [];

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

  /**
   * Validates that title and content have been filled out. If not sets valueError state to true displaying
   * error message and sets input border to error state respectively.
   * If validation passes creates a submittable post object and attempts to submit
   * constructed post from form data.
   * @param e
   */
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
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
      console.log("in submit: " + roleName)
      const postToSubmit: SubmittablePost = {
        id: post?.id || null,
        title,
        content,
        authorId: post?.authorId || null,
        published,
        roleName: roleName !== "none" ? roleName : null
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
          <div className={styles.postFormElement}>
            <label>Published:</label>
            <select
              value={published ? "true" : "false"} // ...force the select's value to match the state variable...
              onChange={(e) => handleSelectChange(e.target.value)} // ... and update the state variable on any change!
            >
              <option value={"true"}>True</option>
              <option value={"false"}>False</option>
            </select>
          </div>
          <div className={styles.postFormElement}>
            <label>* Role</label>
            <select
              value={roleName}
              onChange={(e) => {
                setRoleName(e.target.value);
              }}
            >
              <option value="none">None</option>
              {userRoles.map((role: string) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
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

import React, { useState } from "react";
import styles from "./CreatePostForm.module.css";
import CheckboxDropdown from "@/app/components/CheckboxDropdown/CheckboxDropdown";
import { usePostForm } from "@/hooks/usePostForm";
import { useFetchRoles } from "@/hooks/useFetchRoles";

const CreatePostForm: React.FC = ({ post, onSuccess, onClose }) => {
  const {
    title,
    setTitle,
    content,
    setContent,
    published,
    setPublished,
    selectedRoles,
    setSelectedRoles,
    handleSubmit,
    loading,
    error,
  } = usePostForm(post, onSuccess);

  const { roles, error: rolesError } = useFetchRoles();

  const [titleError, setTitleError] = useState("");
  const [contentError, setContentError] = useState("");
  const [rolesErrorState, setRolesErrorState] = useState("");

  const validateFields = () => {
    let isValid = true;

    if (!title.trim()) {
      setTitleError("Title is required.");
      isValid = false;
    } else {
      setTitleError("");
    }

    if (!content.trim()) {
      setContentError("Content is required.");
      isValid = false;
    } else {
      setContentError("");
    }

    if (selectedRoles.length === 0) {
      setRolesErrorState("At least one role must be selected.");
      isValid = false;
    } else {
      setRolesErrorState("");
    }

    return isValid;
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validateFields()) {
      handleSubmit(e);
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.contentContainer}>
        <div className={styles.header}>
          <h2>Create Post</h2>
          <button className={styles.closeButton} onClick={onClose}>
            &times;
          </button>
        </div>
        <form onSubmit={handleFormSubmit} className={styles.form}>
          <div className={styles.contentForm}>
            <div className={styles.contentFormLeft}>
              <div className={styles.postFormElement}>
                <label>
                  Title<span className={styles.asterisk}>*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
                {titleError && <p className={styles.error}>{titleError}</p>}
              </div>
              <div className={styles.postFormElement}>
                <label>
                  Add to reading list<span className={styles.asterisk}>*</span>
                </label>
                {rolesError ? (
                  <p>{rolesError}</p>
                ) : (
                  <CheckboxDropdown
                    options={roles}
                    selectedOptions={selectedRoles}
                    onChange={setSelectedRoles}
                  />
                )}
                {/* Only show the roles error state when the form is submitted */}
                {rolesErrorState && (
                  <p className={styles.error}>{rolesErrorState}</p>
                )}
              </div>
              {error && <p className={styles.error}>{error}</p>}
            </div>
            <div className={styles.contentFormRight}>
              <div className={styles.postFormElement}>
                <label>
                  Content<span className={styles.asterisk}>*</span>
                </label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                />
                {contentError && <p className={styles.error}>{contentError}</p>}
              </div>
              <div className={styles.submitContainer}>
                <div>
                  <label>
                    Save as draft<span className={styles.asterisk}>*</span>
                  </label>
                  <input
                    type="checkbox"
                    checked={published}
                    onChange={(e) => setPublished(e.target.checked)}
                  />
                </div>
                <button type="submit" className={styles.submitButton}>
                  {loading ? "Submitting..." : "Submit"}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePostForm;

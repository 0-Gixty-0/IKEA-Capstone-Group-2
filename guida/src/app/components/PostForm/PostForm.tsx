import React, { useState } from "react";
import styles from "./PostForm.module.css";
import CheckboxDropdown from "@/app/components/CheckboxDropdown/CheckboxDropdown";
import { usePostForm } from "@/hooks/usePostForm";
import { PostFormProps } from "@/types";
import { mapRolesToOptions } from "@/utils/mapRolesToOptions";
import {mapTagsToOptions} from "@/utils/mapTagsToOptions";
import { useAuthorInPosts } from "@/hooks/useAuthorInPosts";

const PostForm: React.FC<PostFormProps> = ({ post, submitText, onSuccess, onClose }) => {
  const {
    title,
    setTitle,
    pdfUrl,
    setPdfUrl,
    content,
    setContent,
    published,
    setPublished,
    tags,
    selectedRoles,
    setSelectedRoles,
    selectedTags,
    setSelectedTags,
    handleFormSubmit,
    loading,
    error,
    roles,
    rolesError,
    titleError,
    contentError,
    rolesErrorState,
    userRoles,
    userRolesLoading,
    userRolesError,
    selectedAuthorRole,
    setSelectedAuthorRole
  } = usePostForm(onSuccess, post);

  

  return (
    <div className={styles.overlay}>
      <div className={styles.contentContainer}>
        <div className={styles.header}>
          <h2>{submitText}</h2>
          <button className={styles.closeButton} onClick={onClose}>
            &times;
          </button>
        </div>
        <form onSubmit={handleFormSubmit} className={styles.form}>
          <div className={styles.contentForm}>
            <div className={styles.contentFormLeft}>

              <div className={styles.postFormElement}> {/*Add title box*/}
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
                    Publish as Role
                </label>
                <select
                  value={Number(selectedAuthorRole)}
                  onChange={(e) => {setSelectedAuthorRole(Number(e.target.value));}}
                >
                <option value={undefined}>None</option>
                {userRoles.map((role) => (
                  <option key={role.label} value={role.value}>
                    {role.label}
                  </option>
                ))}
                </select>
              </div>

              <div className={styles.postFormElement}> {/*Attach file box*/}
                <label>
                  Tags
                </label>
                {rolesError ? (
                    <p>{rolesError}</p>
                ) : (
                    <CheckboxDropdown
                        options={mapTagsToOptions(tags)}
                        selectedOptions={selectedTags}
                        onChange={setSelectedTags}
                    />
                )}
                {rolesErrorState && (
                    <p className={styles.error}>{rolesErrorState}</p>
                )}
              </div>

              <div className={styles.postFormElement}> {/*Attach file box*/}
                <label>
                  Attach file
                </label>
                <input
                    type="text"
                    value={pdfUrl}
                    onChange={(e) => setPdfUrl(e.target.value)}
                />
              </div>

              {!post && ( // Conditionally render the dropdown
                  <div className={styles.postFormElement}>
                    <label>
                      Add to reading list
                    </label>
                    {rolesError ? (
                        <p>{rolesError}</p>
                    ) : (
                        <CheckboxDropdown
                            options={mapRolesToOptions(roles)}
                            selectedOptions={selectedRoles}
                            onChange={setSelectedRoles}
                        />
                    )}
                    {rolesErrorState && (
                        <p className={styles.error}>{rolesErrorState}</p>
                    )}
                  </div>
              )}
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
                  {loading ? "Submitting..." : submitText}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostForm;
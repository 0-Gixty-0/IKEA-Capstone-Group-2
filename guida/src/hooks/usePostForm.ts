import { useState, useEffect } from "react";
import { Post, SubmittablePost } from "@/types";
import { useSubmitPost } from "@/hooks/useSubmitPost";
import { useFetchRoles } from "@/hooks/useFetchRoles";

export const usePostForm = (
  post: Post,
  onSuccess: (post: Post) => void,
) => {
  const { submitPost, loading, error, success, result } = useSubmitPost();
  const [title, setTitle] = useState<string>(post ? post.title : "");
  const [content, setContent] = useState<string>(post ? post.content : "");
  const [published, setPublished] = useState<boolean>(
    post ? post.published : false,
  );
  const [selectedRoles, setSelectedRoles] = useState<number[]>([]); // Use number[] for role IDs
  const { roles, error: rolesError } = useFetchRoles();

  const [titleError, setTitleError] = useState("");
  const [contentError, setContentError] = useState("");
  const [rolesErrorState, setRolesErrorState] = useState("");

  useEffect(() => {
    if (post) {
      setTitle(post.title);
      setContent(post.content);
      setPublished(post.published);
    }
  }, [post]);

  useEffect(() => {
    if (success && result) {
      console.log(result.post)
      onSuccess(result.post);
    }
  }, [success, result]);

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

    return isValid;
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validateFields()) {
      const postToSubmit: SubmittablePost = {
        id: post?.id || null,
        title,
        content,
        authorId: post?.authorId || null,
        published,
        roles: selectedRoles, // Include selected roles in the post data
      };
      submitPost(postToSubmit);
    }
  };

  return {
    title,
    setTitle,
    content,
    setContent,
    published,
    setPublished,
    selectedRoles,
    setSelectedRoles,
    handleFormSubmit,
    loading,
    error,
    roles,
    rolesError,
    titleError,
    contentError,
    rolesErrorState,
  };
};
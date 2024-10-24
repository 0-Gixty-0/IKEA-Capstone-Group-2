import { useState, useEffect } from "react";
import { Post, SubmittablePost } from "@/types";
import { useSubmitPost } from "@/hooks/useSubmitPost";
import { useFetchRoles } from "@/hooks/useFetchRoles";
import {useFetchTags} from "@/hooks/useFetchTags";

export const usePostForm = (
  post: Post,
  onSuccess: (post: Post) => void,
) => {
  const { submitPost, loading, error, success, result } = useSubmitPost();
  const [title, setTitle] = useState<string>(post ? post.title : "");
  const [content, setContent] = useState<string>(post ? post.content : "");
  const [pdfUrl, setPdfUrl] = useState<string>(post ? post.pdfUrl : "");
  const [published, setPublished] = useState<boolean>(
    post ? post.published : false,
  );
  const [selectedTags, setSelectedTags] = useState<number[]>([])
  const [selectedRoles, setSelectedRoles] = useState<number[]>([]); // Use number[] for role IDs
  const { roles, error: rolesError } = useFetchRoles();
  const { tags, error: tagsError } = useFetchTags()
  const [titleError, setTitleError] = useState("");
  const [contentError, setContentError] = useState("");
  const [rolesErrorState, setRolesErrorState] = useState("");

  useEffect(() => {
    if (post) {
      setTitle(post.title);
      setContent(post.content);
      setPublished(post.published);
      setPdfUrl(post.pdfUrl);
      setSelectedTags(post.tags.map((tag) => {return tag.id}))
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
        pdfUrl,
      };
      submitPost(postToSubmit);
    }
  };

  return {
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
  };
};
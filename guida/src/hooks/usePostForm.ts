// guida/src/hooks/usePostForm.ts
import { useState, useEffect } from "react";
import { Post, SubmittablePost } from "@/types";
import { useSubmitPost } from "@/hooks/useSubmitPost";

export const usePostForm = (post?: Post, onSuccess?: (post: Post) => void) => {
  const { submitPost, loading, error, success, result } = useSubmitPost();
  const [title, setTitle] = useState<string>(post ? post.title : "");
  const [content, setContent] = useState<string>(post ? post.content : "");
  const [published, setPublished] = useState<boolean>(post ? post.published : false);
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);

  useEffect(() => {
    if (post) {
      setTitle(post.title);
      setContent(post.content);
      setPublished(post.published);
    }
  }, [post]);

  useEffect(() => {
    if (success && result && onSuccess) {
      onSuccess(result.post);
    }
  }, [success, result, onSuccess]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (title === "" || content === "") {
      // Handle validation errors
      return;
    }
    const postToSubmit: SubmittablePost = {
      id: post?.id || null,
      title,
      content,
      authorId: post?.authorId || null,
      published,
    };
    submitPost(postToSubmit);
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
    handleSubmit,
    loading,
    error,
  };
};
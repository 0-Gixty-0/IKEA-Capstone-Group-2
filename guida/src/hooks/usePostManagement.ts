import { useState, useEffect } from "react";
import { useFetchPosts } from "@/hooks/useFetchPosts";
import { Post } from "@/types";

/**
 * Custom hook for managing posts.
 * 
 * @returns {Object} The state and handlers for managing posts.
 */
export const usePostManagement = (apiUrl: string) => {
  const { posts, loading, error } = useFetchPosts(apiUrl); // Fetches all posts in the database
  const [clickedPost, setClickedPost] = useState<Post | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [displayedPosts, setDisplayedPosts] = useState<Post[]>([]);
  const { posts: readingList, loading: loadingReadingList, error: errorReadingList } = useFetchPosts('/api/readingList'); // Fetches the reading list

  useEffect(() => {
    if (!loading) {
      setDisplayedPosts(posts);
    }
  }, [loading, posts]);

  /**
   * Handles the click event on a post.
   * 
   * @param {Post} post - The post that was clicked.
   */
  const handlePostClick = (post: Post) => {
    setClickedPost(post);
    setIsEditing(false);
    setIsCreating(false);
  };

  /**
   * Closes the modal and resets the state.
   */
  const closeModal = () => {
    setClickedPost(null);
    setIsEditing(false);
    setIsCreating(false);
  };

  /**
   * Handles the deletion of a post.
   */
  const handlePostDelete = async () => {
    closeModal();
    setDisplayedPosts((displayedPosts) =>
      displayedPosts.filter((post) => post.id !== clickedPost?.id),
    );
  };

  /**
   * Handles post read.
   */
  const handlePostRead = async () => {
    closeModal();
  };
  
  /**
   * Sets the state to editing mode.
   */
  const handleEditPost = () => {
    setIsEditing(true);
  };

  /**
   * Sets the state to creating mode.
   */
  const handleCreatePost = () => {
    setClickedPost(null);
    setIsEditing(false);
    setIsCreating(true);
  };

  /**
   * Handles the success event after creating or editing a post.
   * 
   * @param {Post} post - The post that was successfully created or edited.
   */
  const handleSuccess = (post: Post) => {
    setDisplayedPosts((prevPosts) => {
      const postIndex = prevPosts.findIndex((p) => p.id === post.id);
      if (postIndex !== -1) { // Post already exists, which means the existing post is getting updated.
        const updatedPosts = [...prevPosts];
        updatedPosts[postIndex] = post; // The edited post gets placed at postIndex.
        return updatedPosts;
      } else { // Post does not exist in prevPosts variable, which means the post is a new post
        return [post, ...prevPosts]; // Returns the new post at index 0, followed by prevPosts
      }
    });
    closeModal();
  };

  return {
    posts: displayedPosts,
    readingList,
    loadingReadingList,
    errorReadingList,
    loading,
    error,
    clickedPost,
    isEditing,
    isCreating,
    handlePostClick,
    closeModal,
    handlePostDelete,
    handlePostRead,
    handleEditPost,
    handleCreatePost,
    handleSuccess,
  };
};
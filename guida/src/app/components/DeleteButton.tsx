import React from "react";

interface DeleteButtonProps {
  style?: React.CSSProperties;
  postId: number;
  onDelete: () => void; // Add onDelete 
  className?: string;
}

const DeleteButton: React.FC<DeleteButtonProps> = ({ style, postId, onDelete, className }) => {
  const deleteHandle = async () => {
    if (!postId) {
      console.error("Invalid post ID");
      return; // Exit early if postId is invalid
    }

    const confirmed = window.confirm("Are you sure you want to delete this post?");
    if (!confirmed) {
      return;
    }

    console.log("Deleting post with ID: ", postId);

    try {
      const response = await fetch(`/api/posts?id=${postId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Post deleted: ", data);
        onDelete(); // Call onDelete after successful deletion
      } else {
        console.error("Failed to delete Post");
        // Optionally notify the user about the failure
      }
    } catch (error) {
      console.error("Error:", error);
      // Optionally notify the user about the error
    }
  };

  return (
    <button onClick={deleteHandle} className={className}>
      Delete Post
    </button>
  );
};

export default DeleteButton;
import React from "react";

interface DeleteButtonProps {
  style?: React.CSSProperties;
  postId: number; // Ensure postId is always a valid number
}

const DeleteButton: React.FC<DeleteButtonProps> = ({ style, postId }) => {
  const deleteHandle = async () => {
    if (!postId) {
      console.error("Invalid post ID");
      return; // Exit early if postId is invalid
    }

    try {
      const response = await fetch("/api/deletePost", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ postId }), // Using postId directly
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Post deleted: ", data);
        // You can add user feedback here if needed
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
    <button onClick={deleteHandle} style={style}>
      Delete Post
    </button>
  );
};

export default DeleteButton;

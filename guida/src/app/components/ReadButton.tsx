import React, { useEffect, useState } from "react";

interface ReadButtonProps {
  style?: React.CSSProperties;
  postId: number;
  onRead: () => void;
}

const ReadButton: React.FC<ReadButtonProps> = ({ style, postId, onRead }) => {
  const [isInReadingList, setIsInReadingList] = useState(false);

  useEffect(() => {
    const checkReadingList = async () => {
      try {
        const response = await fetch('/api/readingList');
        if (response.ok) {
          const data = await response.json();
          const isPostInReadingList = data.posts.some((post: { id: number }) => post.id === postId);
          setIsInReadingList(isPostInReadingList);
        } else {
          console.error('Failed to fetch reading list');
        }
      } catch (error) {
        console.error('Error fetching reading list:', error);
      }
    };

    checkReadingList();
  }, [postId]);

  const handleRead = async () => {
    if (!postId) {
      console.error("Invalid post ID");
      return; // Exit early if postId is invalid
    }

    const confirmed = window.confirm("Do you confirm this is read?");
    if (!confirmed) {
      return;
    }

    console.log("Removing post from reading list: ", postId);

    try {
      console.log("Entered try block");
      const response = await fetch(`/api/readingList?id=${postId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log("line before response.ok");
      console.log(response);
      if (response.ok) {
        console.log("Response is ok");
        const data = await response.json();
        console.log("Post deleted: ", data);
        onRead(); // Call onRead after successful deletion
      } else {
        console.error("Failed to delete post");
        // Optionally notify the user about the failure
      }
    } catch (error) {
      console.error("Error from read button:", error);
      // Optionally notify the user about the error
    }
  };

  if (!isInReadingList) {
    return null; // Return nothing if the post is not in the reading list
  }

  return (
    <button onClick={handleRead} style={style}>
      Read post
    </button>
  );
};

export default ReadButton;
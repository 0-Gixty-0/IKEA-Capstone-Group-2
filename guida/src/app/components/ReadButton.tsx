import React from "react";

interface ReadButtonProps {
  style?: React.CSSProperties;
  postId: number;
  onRead: () => void; // Add onDelete prop
}

const ReadButton: React.FC<ReadButtonProps> = ({ style, postId, onRead }) => {
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

      console.log("line before response.ok")
      console.log(response)
      if (response.ok) {
        console.log("Response is ok");
        const data = await response.json();
        console.log("Post deleted: ", data);
        onRead(); // Call onDelete after successful deletion
      } else {
        console.error("test");
        // Optionally notify the user about the failure
      }
    } catch (error) {
      console.error("Error from read button:", error);
      // Optionally notify the user about the error
    }
  };

  return (
    <button onClick={handleRead} style={style}>
      Read post
    </button>
  );
};

export default ReadButton;
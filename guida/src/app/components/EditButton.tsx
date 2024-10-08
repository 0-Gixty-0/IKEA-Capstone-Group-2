import React from "react";

interface EditButtonProps {
  style?: React.CSSProperties;
  postId: number;
  // No onEdit prop or functionality for now
}

const EditButton: React.FC<EditButtonProps> = ({ style, postId }) => {
  // Currently, the button does nothing
  return (
    <button style={style}>
      Edit Post
    </button>
  );
};

export default EditButton;

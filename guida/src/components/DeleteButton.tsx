import React from "react";

interface ButtonProps {
  style?: React.CSSProperties;
  pageId: number;
}

const Button: React.FC<ButtonProps> = ({ style, pageId }) => {
  const deleteHandle = async (pageId: number) => {
    try {
      const response = await fetch("/api/deletePage", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ pageId }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Page deleted: ", data);
      } else {
        console.error("Failed to delete page");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <button onClick={() => deleteHandle(pageId)} style={style}>
      {"Delete Page"}
    </button>
  );
};

export default Button;

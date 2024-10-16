import { useState } from "react";

const TagInput = ({
  tags,
  setTags,
}: {
  tags: string[];
  setTags: React.Dispatch<React.SetStateAction<string[]>>;
}) => {
  const [inputValue, setInputValue] = useState("");

  interface TagInputProps {
    tags: string[];
    setTags: React.Dispatch<React.SetStateAction<string[]>>;
  }

  interface KeyboardEventWithTarget
    extends React.KeyboardEvent<HTMLInputElement> {
    target: HTMLInputElement;
  }

  const addTag = (e: KeyboardEventWithTarget) => {
    if (e.key === "Enter" && inputValue.trim() !== "") {
      e.preventDefault();
      if (!tags.includes(inputValue.trim())) {
        setTags([...tags, inputValue.trim()]);
        setInputValue("");
      }
    }
  };

  const removeTag = (index: number) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  return (
    <div className="tag-input-container">
      <ul className="tags-list">
        {tags.map((tag, index) => (
          <li key={index} className="tag-item">
            {tag}
            <span onClick={() => removeTag(index)} className="tag-remove">
              &times;
            </span>
          </li>
        ))}
      </ul>
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={addTag}
        placeholder="Add a tag and press Enter"
      />
    </div>
  );
};

export default TagInput;

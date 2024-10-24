import React, { useState } from "react";

interface TagInputProps {
  formFieldName: string;
  options: string[];
  onChange: (selected: string[]) => void; // New prop to pass selected options to the parent
}

export default function TagInput({ formFieldName, options, onChange }: TagInputProps) {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

  const toggleDropdown = () => setDropdownVisible(!dropdownVisible);

  const handleOptionChange = (option: string) => {
    let newSelectedOptions;
    if (selectedOptions.includes(option)) {
      newSelectedOptions = selectedOptions.filter((item) => item !== option);
    } else {
      newSelectedOptions = [...selectedOptions, option];
    }
    setSelectedOptions(newSelectedOptions);
    onChange(newSelectedOptions); // Notify the parent of the change
  };

  return (
    <div className="relative inline-block w-64">
      {/* Dropdown trigger */}
      <button
        type="button"
        className="bg-gray-200 border rounded px-4 py-2 cursor-pointer"
        onClick={toggleDropdown}
      >
        Select Tags
      </button>

      {/* Dropdown menu */}
      {dropdownVisible && (
        <div className="absolute left-0 mt-2 w-full bg-white border rounded shadow z-10">
          <ul className="max-h-48 overflow-y-auto">
            {options.map((option) => (
              <li key={option}>
                <label className="flex items-center cursor-pointer px-2 py-1 hover:bg-blue-100">
                  <input
                    type="checkbox"
                    name={formFieldName}
                    value={option}
                    checked={selectedOptions.includes(option)}
                    onChange={() => handleOptionChange(option)}
                    className="cursor-pointer"
                  />
                  <span className="ml-2">{option}</span>
                </label>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

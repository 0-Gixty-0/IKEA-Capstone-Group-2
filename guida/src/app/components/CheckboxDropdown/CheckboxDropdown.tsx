import React, { useState, useMemo, useRef, useEffect } from "react";
import styles from "./CheckboxDropdown.module.css";
import { CheckboxDropdownProps } from "@/types";

const CheckboxDropdown: React.FC<CheckboxDropdownProps> = ({
  options,
  selectedOptions,
  onChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const selectedValue = useMemo(
    () =>
      options
        .filter((option) => selectedOptions.includes(option.value))
        .map((option) => option.label)
        .join(", "),
    [selectedOptions, options],
  );

  const handleCheckboxChange = (value: number) => {
    const newSelectedOptions = selectedOptions.includes(value)
      ? selectedOptions.filter((option) => option !== value)
      : [...selectedOptions, value];
    onChange(newSelectedOptions);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node) &&
      buttonRef.current &&
      !buttonRef.current.contains(event.target as Node)
    ) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className={styles.dropdown} ref={dropdownRef}>
      <button
        ref={buttonRef}
        className={styles.dropdownButton}
        onClick={(e) => {
          e.preventDefault(); // Prevent form submission
          setIsOpen(!isOpen);
        }}
      >
        {selectedValue || "Select Options"}
      </button>
      <div className={`${styles.dropdownContent} ${isOpen ? styles.show : ""}`}>
        {options.map((option) => (
          <div
            key={option.value}
            className={`${styles.dropdownItem} ${
              selectedOptions.includes(option.value) ? styles.selected : ""
            }`}
            onClick={(e) => {
              e.preventDefault(); // Prevent form submission
              e.stopPropagation(); // Stop event propagation
              handleCheckboxChange(option.value);
            }}
          >
            {option.label}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CheckboxDropdown;

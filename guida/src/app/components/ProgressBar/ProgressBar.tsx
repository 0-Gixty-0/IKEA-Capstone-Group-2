// components/ProgressBar.tsx
import React from "react";
import styles from "./ProgressBar.module.css"; // Import CSS Module

interface ProgressBarProps {
  a: number;
  b: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ a, b }) => {
  // Calculate the percentage
  const percentage = b > 0 ? (a / b) * 100 : 0;

  return (
    <div className={styles.progressContainer}>
      <div className={styles.progressBar} style={{ width: `${percentage}%` }} />
      <p className={styles.progressText}>
        {a} / {b} Read
      </p>
    </div>
  );
};

export default ProgressBar;

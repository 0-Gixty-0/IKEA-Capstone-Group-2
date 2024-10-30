import React from "react";
import styles from "./styles.module.css";
interface AccessErrorProps {
  message: string;
}

/**
 * AccessError component displays error message related to user access.
 * Component layers above all other displayed components and dims background preventing access
 * @param param0 Object containing access error message
 * @returns Component
 */
export default function AccessError({ message }: AccessErrorProps) {
  return (
    <div data-testid="access-error-wrapper" className={styles.wrapper}>
      <div data-testid="access-error-container" className={styles.container}>
        <h2>{message}</h2>
        <h3>Contact an admin if you believe you should have access</h3>
      </div>
    </div>
  );
}

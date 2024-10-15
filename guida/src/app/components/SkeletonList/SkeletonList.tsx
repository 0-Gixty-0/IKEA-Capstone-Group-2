import React from "react";
import styles from "./SkeletonList.module.css";

const SkeletonList = () => {
  return (
    <ul>
      {Array.from({ length: 5 }, (_, index) => (
        <li
          key={index}
          className={`${styles.skeleton} ${styles["skeleton-post"]}`}
        ></li>
      ))}
    </ul>
  );
};

export default SkeletonList;
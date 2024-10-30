import React from "react";
import { User } from "next-auth";
import styles from "./PostDetailModalElement.module.css";
import { useRouter } from "next/navigation";

interface IPostDetailModalElement {
  user: User;
}

export default function PostDetailModalElement({
  user,
}: IPostDetailModalElement) {
  const router = useRouter();
  return (
    <li
      className={styles.statsElementContainer}
      onClick={() => {
        router.push(`/profile/${user.id}`);
      }}
    >
      <div className={styles.statsElementContent}>
        <div className={styles.userNamesContainer}>
          <h3>{user.name}</h3>
          <p>{user.username}</p>
        </div>
        <div className={styles.userContactContainer}>
          <p>{user.email}</p>
          <div className={styles.rolesContainer}>
            {user.roles
              .map((role) => Object.values(role)) // Filter out any non-matching roles
              .map((role) => (
                <p>{role}</p>
              ))}
          </div>
        </div>
      </div>
    </li>
  );
}

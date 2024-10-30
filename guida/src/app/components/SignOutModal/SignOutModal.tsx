"use client";
import { signOut } from "next-auth/react";
import styles from "./styles.module.css";
import React from "react";

interface Props {
  onClose: () => void;
}

export default function SignOutModal(props: Props) {
  const { onClose } = props;

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <button className={styles.closeButton} onClick={onClose}>
          &times;
        </button>
        <h2>Sign Out</h2>
        <hr />
        <h3>Are you sure you want to sign out?</h3>
        <button
          className={styles.submitButton}
          onClick={() => signOut({ redirectTo: "/login" })}
        >
          Sign Out
        </button>
      </div>
    </div>
  );
}

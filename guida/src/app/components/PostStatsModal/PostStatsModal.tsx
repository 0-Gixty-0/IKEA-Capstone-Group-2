import styles from "./PostStatsModal.module.css";
import React, { useEffect, useState } from "react";
import { Stats } from "@/hooks/usePostStats";
import { User } from "next-auth";
import Preloader from "@/app/components/Preloader/Preloader";
import PostDetailModalElement from "@/app/components/PostDetailModalElement/PostDetailModalElement";

interface IPostStatsModal {
  onClose: () => void;
  stats: Stats;
}

export default function PostStatsModal({ onClose, stats }: IPostStatsModal) {
  const [allAssignedUsers, setAllAssignedUsers] = useState<User[]>([]);

  useEffect(() => {
    if (stats.readUsers && stats.nonReadUsers) {
      setAllAssignedUsers(stats.readUsers.concat(stats.nonReadUsers));
    }
  }, [stats]);

  return (
    <div id={styles.postStatsModalOverlay}>
      {stats ? (
        <div className={styles.postStatsModalContent}>
          <button className={styles.closeButton} onClick={onClose}>
            &times;
          </button>
          <div className={styles.postsStatsModalColumn}>
            <h2>Users Assigned:</h2>
            <hr />
            <ul>
              {allAssignedUsers.map((user: User) => (
                <PostDetailModalElement user={user} />
              ))}
            </ul>
          </div>
          <div className={styles.postsStatsModalColumn}>
            <h2>Users read:</h2>
            <hr />
            <ul>
              {stats.readUsers.map((user: User) => (
                <PostDetailModalElement user={user} />
              ))}
            </ul>
          </div>
          <div className={styles.postsStatsModalColumn}>
            <h2>Users unread:</h2>
            <hr />
            <ul>
              {stats.nonReadUsers.map((user: User) => (
                <PostDetailModalElement user={user} />
              ))}
            </ul>
          </div>
        </div>
      ) : (
        <Preloader></Preloader>
      )}
    </div>
  );
}

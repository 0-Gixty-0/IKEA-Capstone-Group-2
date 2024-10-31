"use client";

import styles from "./styles.module.css";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

/**
 * Header component.
 * Contains:
 * * Title of application "GUIDA"
 * * Button to access homepage
 * * Button to access profile page
 * Is hidden from user if not logged in
 * @constructor
 */
export default function Header() {
  const router = useRouter();
  const session = useSession();

  /**
   * Handler for safety ensuring must be logged in to access profile page
   */
  const handleProfileClick = () => {
    if (session && session.data) {
      router.push(`/profile/${session.data.user.id}`);
    } else {
      router.push("/login");
    }
  };

    const handleBoardClick = () => {
        if (session && session.data) {
            router.push(`/readRequests/${session.data.user.id}`);
        } else {
            router.push("/login");
        }
    };

  if (session.status === "authenticated") {
    return (
      <div className={styles.container}>
        <h1
          onClick={() => {
            router.push("/");
          }}
          style={{ cursor: "pointer" }}
        >
          GUIDA
        </h1>
          <div className={styles.iconContainer}>
              <div
                  className={styles.iconContent}
                  style={{cursor: "pointer"}}
                  onClick={handleBoardClick}
              >
                  <img src={"/icons/board.png"} alt={"Silhouette of a bulletin board"}/>
              </div>
              <div
                  className={styles.iconContent}
                  style={{cursor: "pointer"}}
                  onClick={handleProfileClick}
              >
                  <img src={"/icons/user_icon.png"} alt={"Silhouette of a person"}/>
              </div>
              <div
                  className={styles.iconContent}
                  style={{cursor: "pointer"}}
                  onClick={() => {
                      router.push("/");
                  }}
              >
                  <img src={"/icons/home_icon.png"} alt={"Silhouette of a house"}/>
              </div>
          </div>
      </div>
    );
  }
}

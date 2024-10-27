import {Post} from "@/types";
import {usePostStats} from "@/hooks/usePostStats";
import React from "react";
import styles from './PostStatsItem.module.css'
import Preloader from "@/app/components/Preloader/Preloader";
import ProgressBar from "@/app/components/ProgressBar/ProgressBar";

interface IPostStatsItem {
    post: Post;
    handleItemClick: (arg0: Post) => void
}

export default function PostStatsItem({post, handleItemClick}: IPostStatsItem) {
    const {stats, loading, error} = usePostStats(post.id)

    return (
        <li className={styles.statsContainer} onClick={() => {handleItemClick(post)}}>
            {loading
                ? (<Preloader></Preloader>)
                : (stats
                        ? (<div className={styles.statsContentContainer}>
                            <div className={styles.postContent}>
                                <h2>{post.title}</h2>
                                <p>{post.content}</p>
                            </div>
                            <div className={styles.statsContent}>
                                <p>Total assigned: {stats.totalAssigned}</p>
                                <p>Users Read: {stats.numRead}</p>
                                <div className={styles.progressBarContainer}>
                                    <ProgressBar a={stats.numRead} b={stats.totalAssigned}/>
                                </div>
                            </div>
                        </div>)
                        : <div className={styles.statsContent}>
                            <h1>{error}</h1>
                        </div>
                )
            }
        </li>
    )
}
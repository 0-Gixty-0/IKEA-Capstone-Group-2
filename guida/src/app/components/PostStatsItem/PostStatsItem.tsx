import {Post} from "@/types";
import {usePostStats} from "@/hooks/usePostStats";
import React from "react";
import styles from './PostStatsItem.module.css'
import Preloader from "@/app/components/Preloader/Preloader";
import ProgressBar from "@/app/components/ProgressBar/ProgressBar";

interface IPostStatsItem {
    post: Post;
}

export default function PostStatsItem({post}: IPostStatsItem) {
    const {stats, loading, error} = usePostStats(post.id)

    return (
        <li className={styles.statsContainer}>
            {loading
                ? (<Preloader></Preloader>)
                : (stats
                        ? (<div className={styles.statsContent}>
                            <h2>Reading Progress</h2>
                            <ProgressBar a={stats?.numRead} b={stats?.totalAssigned}/>
                            </div>)
                        : <div className={styles.statsContent}>
                            <h1>{error}</h1>
                        </div>
                )
            }
        </li>
    )
}
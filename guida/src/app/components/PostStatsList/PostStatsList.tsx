import {Post} from "@/types";
import PostStatsItem from "@/app/components/PostStatsItem/PostStatsItem";
import React from "react";
import styles from './PostStatsList.module.css'

interface IPostStatsList {
    posts: Post[]
}

export default function PostStatsList({posts} : IPostStatsList) {
    return (
        <div className={styles.container}>
            <h2>Reading Progress</h2>
            <ul>
                {posts.map((post) => (
                    <PostStatsItem post={post}/>
                ))}
            </ul>
        </div>
    )
}
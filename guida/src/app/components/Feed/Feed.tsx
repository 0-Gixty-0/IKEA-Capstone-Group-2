import styles from "./styles.module.css";
import SkeletonList from "@/app/components/SkeletonList/SkeletonList";
import PostList from "@/app/components/PostList/PostList";
import React from "react";
import {Post} from "@/types";

interface FeedProps {
    title: string,
    loadingPosts: boolean,
    error: string | null
    posts: Post[]
}

export default function Feed({title, loadingPosts, error, posts}: FeedProps) {
    return (
        <div>
            <h2 id={styles.feedTitle}>{title}</h2>
            {loadingPosts
                ? (<SkeletonList></SkeletonList>)
                : (error)
                    ? (<h3>{error}</h3>)
                    : (posts && posts.length > 0)
                        ? (<PostList posts={posts} handlePostClick={() => {
                        }}></PostList>)
                        : (<h3 id={styles.emptyMessage}>No posts found!</h3>)}
        </div>
    )
}
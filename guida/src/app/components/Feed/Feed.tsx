import styles from "./styles.module.css";
import SkeletonList from "@/app/components/SkeletonList/SkeletonList";
import PostList from "@/app/components/PostList/PostList";
import React, {useEffect, useState} from "react";
import {Post} from "@/types";
import PostSearchBar from "@/app/components/PostSearchBar/PostSearchBar";
import PostDetailModal from "@/app/components/PostDetailModal/PostDetailModal";
import {useFeedManagement} from "@/hooks/useFeedManagement";

interface FeedProps {
    title: string,
    loadingPosts: boolean,
    error: string | null,
    posts: Post[],
    emptyMessage: string
}

/**
 * Feed component displays posts in list conditionally.
 * Component also handles feed state and display of detailed post view.
 * When loading displays skeletons.
 * If error displays error message.
 * If length of supplied posts is 0 displays message
 * Otherwise display posts
 * @param title Title of feed
 * @param loadingPosts Boolean for loading of posts
 * @param error Error message
 * @param posts List of posts to display
 * @param emptyMessage Message when posts list is empty
 * @constructor
 */
export default function Feed({title, loadingPosts, error, posts, emptyMessage}: FeedProps) {
    const [showNoSearchResults, setShowNoSearchResults] = useState<boolean>(false)
    const {displayedPosts, setDisplayedPosts, handleDelete,
        showDetailedPostModal, onClose, handlePostClick,
        clickedPost, handleEdit} = useFeedManagement(posts)

    useEffect(() => {
        setDisplayedPosts(posts)
    }, [posts]);

    return (
        <div className={styles.feedContainer}>
            {(showDetailedPostModal && clickedPost) && <PostDetailModal
                    onClose={onClose}
                    post={clickedPost}
                    onDelete={handleDelete}
                    onEdit={handleEdit}
                    onRead={onClose}>
            </PostDetailModal>
            }
            <h2 id={styles.feedTitle}>{title}</h2>
            <PostSearchBar
                entries={posts}
                setEntries={setDisplayedPosts}
                setShowNoSearchResults={setShowNoSearchResults}>
            </PostSearchBar>
            {loadingPosts
                ? (<SkeletonList></SkeletonList>)
                : (error)
                    ? (<h3>{error}</h3>)
                    : (displayedPosts && displayedPosts.length > 0)
                        ? (<PostList posts={displayedPosts} handlePostClick={handlePostClick}></PostList>)
                        : (showNoSearchResults)
                            ? (<h3 id={styles.emptyMessage}>No posts match your search!</h3>)
                            : (<h3 id={styles.emptyMessage}>{emptyMessage}</h3>)}
        </div>
    )
}
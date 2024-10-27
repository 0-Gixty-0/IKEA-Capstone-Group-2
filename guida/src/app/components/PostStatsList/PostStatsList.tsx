import {Post} from "@/types";
import PostStatsItem from "@/app/components/PostStatsItem/PostStatsItem";
import React, {useEffect, useState} from "react";
import styles from './PostStatsList.module.css'
import PostDetailModal from "@/app/components/PostDetailModal/PostDetailModal";
import {useFeedManagement} from "@/hooks/useFeedManagement";
import PostSearchBar from "@/app/components/PostSearchBar/PostSearchBar";
import SkeletonList from "@/app/components/SkeletonList/SkeletonList";
import PostList from "@/app/components/PostList/PostList";

interface IPostStatsList {
    posts: Post[],
    title: string,
    loadingPosts: boolean,
    error: string | null,
    emptyMessage: string
}

export default function PostStatsList({posts, title, loadingPosts, error, emptyMessage} : IPostStatsList) {
    const [showNoSearchResults, setShowNoSearchResults] = useState<boolean>(false)
    const {displayedPosts, setDisplayedPosts, handleDelete,
        showDetailedPostModal, onClose, handlePostClick,
        clickedPost, handleEdit} = useFeedManagement(posts)

    useEffect(() => {
        setDisplayedPosts(posts)
    }, [posts]);

    return (
        <div className={styles.container}>
            {(showDetailedPostModal && clickedPost) && <PostDetailModal
                onClose={onClose}
                post={clickedPost}
                onDelete={handleDelete}
                onEdit={handleEdit}
                onRead={handleDelete}>
            </PostDetailModal>
            }
            <h2 id={styles.feedTitle}>{title}</h2>
            {(displayedPosts.length !== 0 || showNoSearchResults) &&
                <PostSearchBar
                    entries={posts}
                    setEntries={setDisplayedPosts}
                    setShowNoSearchResults={setShowNoSearchResults}>
                </PostSearchBar>
            }
            {loadingPosts
                ? (<SkeletonList></SkeletonList>)
                : (error)
                    ? (<h3>{error}</h3>)
                    : (displayedPosts && displayedPosts.length > 0)
                        ? (<ul>
                            {posts.map((post) => (
                                <PostStatsItem post={post} handleItemClick={handlePostClick}/>
                            ))}
                        </ul>)
                        : (showNoSearchResults)
                            ? (<h3 id={styles.emptyMessage}>No posts match your search!</h3>)
                            : (<h3 id={styles.emptyMessage}>{emptyMessage}</h3>)}
        </div>
    )
}
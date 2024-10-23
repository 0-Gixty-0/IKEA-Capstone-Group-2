import {Post} from "@/types";
import {useState} from "react";

/**
 * Custom hook for managing state of feed.
 * Handles post edits and deletions as well as managing the detailedPostModal.
 * @param initialPosts The initial posts supplied to the feed.
 */
export const useFeedManagement = (initialPosts: Post[]) => {
    const [displayedPosts, setDisplayedPosts] = useState<Post[]>(initialPosts)
    const [showDetailedPostModal, setShowDetailedPostModal] = useState<boolean>(false)
    const [clickedPost, setClickedPost] = useState<Post | null>(null)

    /**
     * When post is clicked show detailed view and set clicked post
     * @param clickedPost Post that has been clicked
     */
    const handlePostClick = (clickedPost: Post) => {
        setShowDetailedPostModal(true)
        setClickedPost(clickedPost)
    }

    /**
     * General close method closes detailedPostModal
     */
    const onClose = () => {
        setShowDetailedPostModal(false)
    }

    /**
     * Handles the deletion of a post and closed detailedPostModal.
     */
    const handleDelete = (clickedPost: Post) => {
        setDisplayedPosts((displayedPosts) =>
            displayedPosts.filter((post) => post.id !== clickedPost.id),
        );
        setShowDetailedPostModal(false)
    };

    /**
     * Handles edit on a post. If a post has been edited
     * update displayed posts with new edited post.
     * Otherwise, no changes are made to the displayedPosts list.
     * @param post Post that has been edited.
     */
    const handleEdit = (post: Post) => {
        setDisplayedPosts((prevPosts) => {
            const postIndex = prevPosts.findIndex((p) => p.id === post.id);
            if (postIndex !== -1) { // Post already exists, which means the existing post is getting updated.
                const updatedPosts = [...prevPosts];
                updatedPosts[postIndex] = post; // The edited post gets placed at postIndex.
                return updatedPosts;
            } else {
                return prevPosts
            }
        })
        setShowDetailedPostModal(false)
    }

    return {
        displayedPosts, setDisplayedPosts, handleDelete,
        showDetailedPostModal, onClose, handlePostClick, clickedPost,
        handleEdit
    }
}
import {Post} from "@/types";
import {useState} from "react";

export const useFeedManagement = (initialPosts: Post[]) => {
    const [displayedPosts, setDisplayedPosts] = useState<Post[]>(initialPosts)
    const [showDetailedPostModal, setShowDetailedPostModal] = useState<boolean>(false)
    const [clickedPost, setClickedPost] = useState<Post | null>(null)

    const handlePostClick = (clickedPost: Post) => {
        setShowDetailedPostModal(true)
        setClickedPost(clickedPost)
    }

    const onClose = () => {
        setShowDetailedPostModal(false)
    }

    /**
     * Handles the deletion of a post.
     */
    const handleDelete = (clickedPost: Post) => {
        setDisplayedPosts((displayedPosts) =>
            displayedPosts.filter((post) => post.id !== clickedPost.id),
        );
        setShowDetailedPostModal(false)
    };

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
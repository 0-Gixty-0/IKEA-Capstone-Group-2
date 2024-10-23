import {Post} from "@/types";
import {useState} from "react";
import PostForm from "@/app/components/PostForm/PostForm";

interface  NewPostButtonProps {
    onSuccess: (arg0: Post) => void
}

export default function NewPostButton({onSuccess}: NewPostButtonProps) {
    const [showPostForm, setShowPostForm] = useState<boolean>(false)

    const handleButtonClick = () => {
        setShowPostForm(true)
    }

    const handleCreateNewPost = (post: Post) => {
        setShowPostForm(false)
        onSuccess(post)
    }

    return (
        <>
            {showPostForm && <PostForm
                submitText={"Create Post"}
                onClose={() => {setShowPostForm(false)}}
                onSuccess={handleCreateNewPost}/>}
            <button onClick={handleButtonClick}>Create New Post!</button>
        </>
    )
}
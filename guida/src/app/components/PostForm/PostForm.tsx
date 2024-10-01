import React, {useEffect, useState} from "react";
import {Post, SubmittablePost} from "@/types";

interface IPostForm {
    handleSubmit: (e: { preventDefault: () => void; }, post: SubmittablePost) => void,
    post?: Post,
    submitText: string
}

export default function PostForm(props: IPostForm) {
    const { handleSubmit, post, submitText } = props;
    const [title, setTitle] = useState<string>(props.post ? props.post.title : '')
    const [content, setContent] = useState<string>(props.post ? props.post.content : '')
    const [published, setPublished] = useState<boolean>(props.post ? props.post.published : false)

    useEffect(() => {
        if (post) {
            setTitle(post.title);
            setContent(post.content);
            setPublished(post.published);
        }
    }, [post]);

    const handleSelectChange = (targetValue : string) => {
        const value = targetValue === "true"; // Convert string to boolean
        setPublished(value); // Update the state
    };

    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const postToSubmit: SubmittablePost = {
            id: post?.id || null,
            title,
            content,
            authorId: post?.authorId || 1, //TODO MODIFY TO INCLUDE NEW POST FOR LOGGED IN USER
            published,
        };

        handleSubmit(e, postToSubmit);
    }

    return (
        <div className="post-form">
            <h2>Edit Article</h2>
            <form onSubmit={onSubmit}>
                <div>
                    <label>
                        Title:
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </label>
                </div>
                <div>
                    <label>
                        Content:
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                        />
                    </label>
                </div>
                <div>
                    <label>
                        Published:
                        <select
                            value={published ? 'true' : 'false'} // ...force the select's value to match the state variable...
                            onChange={e => handleSelectChange(e.target.value)} // ... and update the state variable on any change!
                        >
                            <option value={"true"}>True</option>
                            <option value={"false"}>False</option>
                        </select>
                    </label>
                </div>
                <button type="submit">{submitText}</button>
            </form>
        </div>
    )
}
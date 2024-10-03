import React, {useEffect, useState} from "react";
import {Post, SubmittablePost} from "@/types";
import {useSubmitPost} from "@/hooks/useSubmitPost";
import styles from "./styles.module.css"

interface IPostForm {
    post?: Post,
    submitText: string
}

export default function PostForm(props: IPostForm) {
    const { post, submitText } = props;
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

    const { submitPost, loading, error } = useSubmitPost();

    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const postToSubmit: SubmittablePost = {
            id: post?.id || null,
            title,
            content,
            authorId: post?.authorId || 1, //TODO MODIFY TO INCLUDE NEW POST FOR LOGGED IN USER
            published,
        };

        submitPost(postToSubmit);
    }

    return (
        <div className={styles.postFormOverlay}>
            <div className={styles.postFormContent}>
                <h2>Edit Article</h2>
                <hr/>
                <form onSubmit={onSubmit}>
                    <div className={styles.postFormElement}>
                        <label>
                            Title:
                        </label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </div>
                    <div className={styles.postFormElement}>
                        <label>
                            Content:
                        </label>
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                        />
                    </div>
                    <div className={styles.postFormElement}>
                        <label>
                            Published:
                        </label>
                        <select
                            value={published ? 'true' : 'false'} // ...force the select's value to match the state variable...
                            onChange={e => handleSelectChange(e.target.value)} // ... and update the state variable on any change!
                        >
                            <option value={"true"}>True</option>
                            <option value={"false"}>False</option>
                        </select>
                    </div>
                    <button type="submit">{submitText}</button>
                </form>
            </div>
        </div>
    )
}
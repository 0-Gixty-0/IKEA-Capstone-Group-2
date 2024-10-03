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
    const [valueError, setValueError] = useState<boolean>(false)
    const [titleError, setTitleError] = useState<boolean>(false);
    const [contentError, setContentError] = useState<boolean>(false);
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

        if (title === '') {
            setTitleError(true)
            setValueError(true)
        }
        if (content === '') {
            setContentError(true)
            setValueError(true)
        }

        if (title !== '' && content !== '') {
            const postToSubmit: SubmittablePost = {
                id: post?.id || null,
                title,
                content,
                authorId: post?.authorId || 1, //TODO MODIFY TO INCLUDE NEW POST FOR LOGGED IN USER
                published,
            };

            submitPost(postToSubmit);
        }
    }

    return (
        <div className={styles.postFormOverlay}>
            <div className={styles.postFormContent}>
                <h2>{submitText}</h2>
                <hr/>
                <form onSubmit={onSubmit}>
                    <div className={styles.postFormElement}>
                        <label>
                            * Title:
                        </label>
                        <input
                            className={titleError ? styles.errorBorder : ''}
                            type="text"
                            value={title}
                            onChange={(e) => {
                                setTitle(e.target.value)
                                setTitleError(false);
                                setValueError(false)
                            }}
                        />
                    </div>
                    <div className={styles.postFormElement}>
                        <label>
                            * Content:
                        </label>
                        <textarea
                            className={contentError ? styles.errorBorder : ''}
                            value={content}
                            onChange={(e) => {
                                setContent(e.target.value)
                                setContentError(false)
                                setValueError(false)
                            }}
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
                {valueError && <p className={styles.errorMessage}>Required fields are missing!</p>}
                {error && <p className={styles.errorMessage}>{error}</p>}
            </div>
        </div>
    )
}
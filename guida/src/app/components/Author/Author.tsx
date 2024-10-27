import { useAuthorInPosts } from "@/hooks/useAuthorInPosts";
import { FetchedUser, Post } from "@/types";
import { useFetchUser } from "@/hooks/useFetchUser";
import { useEffect, useState } from "react";
import ProfilePicture from "../ProfilePicture/ProfilePicture";
import styles from "./Author.module.css";

interface AuthorProps {
    authorId: number | undefined,
    roleId: number | undefined
}



export function Author({authorId, roleId}: AuthorProps) {
    const {authorAndRole, loading} = useAuthorInPosts(authorId, roleId);
    const {fetchUser, loading: userLoading, error} = useFetchUser();
    const [authorData, setAuthorData] = useState<FetchedUser | null>(null);



    useEffect(() => {
        const runEffect = async () => {
            if (authorId && !loading) {
                fetchUser(authorId).then((result) => {
                    console.log(result)
                    if (result) {
                        setAuthorData(result);
                    }
                })
            }
        }

        runEffect()
        console.log(authorData)
    }, [authorId, loading]);

    return (
        <div className={styles['author-container']}>
            {loading ? (
                <p>Loading...</p>
            ) : (
                <>  {authorData?.profilePicture && (
                    <div className={styles.picture}>
                        <ProfilePicture imageUrl={authorData.profilePicture}></ProfilePicture>
                    </div>
                )}
                    {authorAndRole && (
                        <div id={styles.author}>
                            <h2>{authorAndRole}</h2>
                        </div>
                    )}
                    
                </>
            )}
        </div>
    );

    
  
}
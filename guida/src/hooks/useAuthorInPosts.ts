import { Post } from '@/types';
import {useState, useEffect} from 'react';
import { useFetchAuthorAndRoleOfPost } from './useFetchAuthorAndRoleOfPost';


/**
 * Hook for getting the author of a post and the role for a post 
 * @param clickedPost 
 * @returns Author + role if role for that post exists
 */
export const useAuthorInPosts = (authorId: number | undefined, roleId: number | undefined) => {
    const {authorAndRole: [author, role]} = useFetchAuthorAndRoleOfPost(roleId, authorId);
    const [authorAndRole, setAuthorAndRole] = useState<string | undefined>("")
    const [loading, setLoading] = useState<boolean>(true)

    useEffect(() => {
        setLoading(true)
        if (authorId) {
            if (role) {
                setAuthorAndRole(`${author} from ${role}`)
            } else {
                setAuthorAndRole(author ? author : "Unknown");
            } 
        } else {
            setAuthorAndRole(undefined)
        }
        setLoading(false)
    }, [authorId, roleId, author, role])


    return {authorAndRole, loading}
}


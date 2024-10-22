import { Post } from '@/types';
import {useState, useEffect} from 'react';
import { useAuthorAndRole } from './useAuthorAndRole';


/**
 * Hook for getting the author of a post and the role for a post 
 * @param clickedPost 
 * @returns Author + role if role for that post exists
 */
export const useAuthorInPosts = (clickedPost: Post | undefined) => {
    const [author, role] = useAuthorAndRole(clickedPost?.roleId, clickedPost?.authorId);
    const [authorAndRole, setAuthorAndRole] = useState<string | undefined>("")
    const [loading, setLoading] = useState<boolean>(true)
    useEffect(() => {
        setLoading(true)
        if (clickedPost) {
            if (role) {
                setAuthorAndRole(`${author} from ${role}`)
            } else {
                setAuthorAndRole(author ? author : "Unknown");
            } 
        } else {
            setAuthorAndRole(undefined)
        }
        setLoading(false)
    }, [clickedPost?.authorId, clickedPost?.roleId, author, role])
    return {authorAndRole, loading}
}


import { Post } from '@/types';
import {useState, useEffect} from 'react';
import { useAuthorAndRole } from './useAuthorAndRole';

export const useAuthorInPosts = (clickedPost: Post | undefined) => {
    const [author, role] = useAuthorAndRole(clickedPost?.authorId, clickedPost?.roleId);
    const [authorAndRole, setAuthorAndRole] = useState<string | null>("")
    useEffect(() => {
        if (clickedPost) {
            if (role) {
                setAuthorAndRole(`${author} from ${role}`)
            } else {
                setAuthorAndRole(author ? author : "Unknown");
            } 
        } else {
            setAuthorAndRole(null)
        }
    }, [clickedPost])
    return authorAndRole
}


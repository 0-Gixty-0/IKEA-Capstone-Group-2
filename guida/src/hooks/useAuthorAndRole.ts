import { useEffect, useState } from "react";

/**
* Returns the author and role name for a given roleId and authorId
* If no roleId is provided, the role will be undefined
* @param roleId
* @param authorId
*/
export function useAuthorAndRole(roleId: number, authorId: number) {
    const [author, setAuthor] = useState<string>("");
    const [role, setRole] = useState<string | undefined>("");

    useEffect(() => {
        
        async function fetchRoleNameAndAuthor(roleId: number, authorId: number) {
            if (roleId) {
                try {
                const response = await fetch(`/api/roles?id=${roleId}`);
                const data = await response.json();
                setRole(data.role.name); // Set the role name after fetching it
                } catch (error) {
                console.error("Error fetching role name:", error);
                }
            }else {
                setRole(undefined)
            }
            try {
                const response = await fetch(`/api/user?id=${authorId}`);
                const data = await response.json();
                setAuthor(data.name); // Set the author name after fetching it
            } catch (error) {
                console.error("Error fetching author name:", error);
            }
        
        }

        fetchRoleNameAndAuthor(roleId, authorId); // Fetch role name on component mount or roleId change
    }, [roleId, authorId]);
    return [author, role];
}
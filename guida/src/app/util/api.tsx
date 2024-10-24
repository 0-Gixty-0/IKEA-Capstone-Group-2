export const fetchTagsForPost = async (postId: number) => {
    const response = await fetch(`/api/tags?postId=${postId}`); // Note the query parameter
    if (!response.ok) {
        throw new Error('Failed to fetch tags');
    }
    return await response.json(); // Assuming your API returns an array of tags
};

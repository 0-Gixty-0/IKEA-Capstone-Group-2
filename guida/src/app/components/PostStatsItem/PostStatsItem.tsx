import {Post} from "@/types";
import {usePostStats} from "@/hooks/usePostStats";

interface IPostStatsItem {
    post: Post;
}

export default function PostStatsItem({post}: IPostStatsItem) {
    const {} = usePostStats(post.id, [1])

    return (
        <li>
            <h2>{post.title}</h2>
        </li>
    )
}
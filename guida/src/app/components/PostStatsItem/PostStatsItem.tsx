import {Post} from "@/types";
import {usePostStats} from "@/hooks/usePostStats";

interface IPostStatsItem {
    post: Post;
}

export default function PostStatsItem({post}: IPostStatsItem) {
    const {stats, loading, error} = usePostStats(post.id)

    return (
        <li>
            {!loading && <h2>{JSON.stringify(stats)}</h2>}
        </li>
    )
}
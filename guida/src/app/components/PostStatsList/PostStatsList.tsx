import {Post} from "@/types";
import PostStatsItem from "@/app/components/PostStatsItem/PostStatsItem";

interface IPostStatsList {
    posts: Post[]
}

export default function PostStatsList({posts} : IPostStatsList) {
    return (
        <ul>
            {posts.map((post) => (
                <PostStatsItem post={post}/>
            ))}
        </ul>
    )
}
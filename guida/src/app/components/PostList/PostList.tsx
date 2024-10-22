import React from "react";
import PostItem from "../PostItem/PostItem";
import { PostListProps } from "@/types";

const PostList: React.FC<PostListProps> = ({ posts, handlePostClick }) => {
  return (
    <ul>
      {posts.map((post) => (
        <PostItem
          key={post.id}
          id={post.id}
          title={post.title}
          content={post.content}
          published={post.published}
          authorId={post.authorId}
          handlePostClick={handlePostClick} 
          pdfUrl={post.pdfUrl}/>
      ))}
    </ul>
  );
};

export default PostList;
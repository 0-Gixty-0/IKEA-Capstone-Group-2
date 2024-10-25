"use client";

import React, { useEffect, useState } from "react";
import styles from "./page.module.css";
import Feed from "@/app/components/Feed/Feed";
import {Post} from "@/types";
import NewPostButton from "@/app/components/NewPostButton/NewPostButton";
import {useFetchPosts} from "@/hooks/useFetchPosts";

const HomePage: React.FC = () => {
  const [isClient, setIsClient] = useState(false);
  const [displayedSuggestedPosts, setDisplayedSuggestedPosts] = useState<Post[]>([])
  const { posts: suggestedPosts, loading: loadingSuggestedPosts, error: suggestedPostsError } =
      useFetchPosts('/api/posts', {published: true})
  const { posts: readingList, loading: loadingReadingList, error: readingListError } =
      useFetchPosts('/api/readingList', {published: true})

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!loadingSuggestedPosts) {
      setDisplayedSuggestedPosts(suggestedPosts)
    } else {
      return
    }
  }, [loadingSuggestedPosts]);


  if (!isClient) {
    return null; // or a loading spinner
  }

  const onSuccessfulNewPost = (newPost: Post) => {
    setDisplayedSuggestedPosts([newPost, ...displayedSuggestedPosts])
  }

  return (
    <div className={styles.fullScreen}>
      <div className={styles.postContainer}>
        <NewPostButton onSuccess={onSuccessfulNewPost}></NewPostButton>
        <Feed
            title={"Reading list"}
            loadingPosts={loadingReadingList}
            error={readingListError}
            posts={readingList}
            emptyMessage={"All posts read! Good job!"}>
        </Feed>
        <Feed
            title={"Suggested posts"}
            loadingPosts={loadingSuggestedPosts}
            error={suggestedPostsError}
            posts={displayedSuggestedPosts}
            emptyMessage={"No posts in the database"}>
        </Feed>
      </div>
    </div>
  );
};

export default HomePage;
"use client";
import React, { useState, useEffect } from "react";

interface Article {
  id: number;
  title: string;
  content: string;
  published: boolean;
  authorId: number;
}

export default function EditArticle(article: Article) {
  // Set up state for the article properties
  const [post, setPost] = useState<Article | null>(null);
  const [title, setTitle] = useState<string>();
  const [content, setContent] = useState<string>();
  const [published, setPublished] = useState<boolean>();

  useEffect(() => {
    // Fetch the post from the /api/posts endpoint
    async function fetchPost() {
      try {
        const response = await fetch("/api/posts");
        if (!response.ok) {
          throw new Error("Failed to fetch post");
        }
        const data = await response.json();
        setPost(data); // Set the fetched post data in the state
        setTitle(data.title);
        setContent(data.content);
        setPublished(data.published);
      } catch (err) {
        console.error(err);
      }
    }

    fetchPost();
  }, []);

  // Function to handle form submission for editing the post
  async function handleSubmit(e: { preventDefault: () => void }) {
    e.preventDefault();
    try {
      const response = await fetch("/api/posts", {
        method: "PUT", // Send a PUT request to update the post
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: post?.id, // Send the post id along with the updated data
          title,
          content,
          published,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update post");
      }

      const updatedPost = await response.json();
      alert("Post updated successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to update post");
    }
  }

  const handleSelectChange = (targetValue: string) => {
    const value = targetValue === "true"; // Convert string to boolean
    setPublished(value); // Update the state
  };

  return (
    <div className="edit-article">
      <h2>Edit Article</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Title:
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </label>
        </div>
        <div>
          <label>
            Content:
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </label>
        </div>
        <div>
          <label>
            Published:
            <select
              value={published ? "true" : "false"} // ...force the select's value to match the state variable...
              onChange={(e) => handleSelectChange(e.target.value)} // ... and update the state variable on any change!
            >
              <option value={"true"}>True</option>
              <option value={"false"}>False</option>
            </select>
          </label>
        </div>
        <button type="submit">Update Post</button>
      </form>
    </div>
  );
}

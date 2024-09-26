'use client'
import React, { useState, useEffect } from 'react';

interface Article {
  id: number,
  title: string,
  content: string,
  published: boolean,
  authorId: number
}

export default function EditArticle(article : Article) {
  // Set up state for the article properties
  const [post, setPost] = useState(null)
  const [title, setTitle] = useState<string>()
  const [content, setContent] = useState<string>()
  const [published, setPublished] = useState<boolean>()

  useEffect(() => {
    // Fetch the post from the /api/posts endpoint
    async function fetchPost() {
      try {
        const response = await fetch('/api/posts');
        if (!response.ok) {
          throw new Error('Failed to fetch post');
        }
        const data = await response.json();
        setPost(data); // Set the fetched post data in the state
        setTitle(data.title)
        setContent(data.content)
        setPublished(data.published)

      } catch (err) {
        console.error(err);
      }
    }

    fetchPost();
  }, []);

  return (
    <div className="edit-article">
      <div>{JSON.stringify(post)}</div>
      <h2>Edit Article</h2>
      <form>
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
        <button type="button">
          Save
        </button>
      </form>
    </div>
  );
};
import React, { useState, useEffect } from 'react';

// Mock function to represent saving to an API
const saveArticle = (article) => {
  // Replace with actual API call logic
  console.log('Article saved:', article);
};

const EditArticle = ({ article, onSave }) => {
  // Set up state for the article properties
  const [title, setTitle] = useState(article.title || '');
  const [content, setContent] = useState(article.content || '');
  const [author, setAuthor] = useState(article.author || '');

  // Update state when the article prop changes (useful for edits vs. new articles)
  useEffect(() => {
    setTitle(article.title || '');
    setContent(article.content || '');
    setAuthor(article.author || '');
  }, [article]);

  // Handler for form submission
  const handleSave = () => {
    const updatedArticle = { ...article, title, content, author };
    saveArticle(updatedArticle); // Or call a prop method like `onSave(updatedArticle)`
    if (onSave) {
      onSave(updatedArticle);
    }
  };

  return (
    <div className="edit-article">
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
        <div>
          <label>
            Author:
            <input
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
            />
          </label>
        </div>
        <button type="button" onClick={handleSave}>
          Save
        </button>
      </form>
    </div>
  );
};

// Usage example with a mock article
const mockArticle = {
  title: 'Sample Article',
  content: 'This is a sample article content.',
  author: 'John Doe',
};

const App = () => {
  const handleSave = (updatedArticle) => {
    console.log('Article updated:', updatedArticle);
    // You can also make an API call here to save the article
  };

  return (
    <div>
      <EditArticle article={mockArticle} onSave={handleSave} />
    </div>
  );
};

export default App;
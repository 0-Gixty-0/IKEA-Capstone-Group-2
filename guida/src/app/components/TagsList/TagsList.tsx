import React from 'react';
import styles from './TagsList.module.css';

interface TagsListProps {
    tags: { id: number; name: string }[];
}

const TagsList: React.FC<TagsListProps> = ({ tags }) => {
  if (!tags || tags.length === 0) {
    return null;
  }

  return (
    <div className={styles.tags}>
      {tags.map((tag, index) => (
        <span key={index} className={styles.tag}>
          {tag.name}
        </span>
      ))}
    </div>
  );
};

export default TagsList;
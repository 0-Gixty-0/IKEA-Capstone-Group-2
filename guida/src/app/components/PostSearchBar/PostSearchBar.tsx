import styles from "./styles.module.css";
import { Post } from "@/types";

interface PostSearchBarProps {
  entries: Post[];
  setShowNoSearchResults: (arg0: boolean) => void;
  setEntries: (arg0: Post[]) => void;
}

const PostSearchBar = ({
  entries,
  setShowNoSearchResults,
  setEntries,
}: PostSearchBarProps) => {
  const handleSearch = (inputValue: string) => {
    const value = String(inputValue).toLowerCase();
    if (value) {
      const updatedEntries = [
        ...entries.filter((entry) => {
          return entry.title.toLowerCase().includes(value);
        }),
      ];
      if (updatedEntries.length > 0) {
        setShowNoSearchResults(false);
        setEntries(updatedEntries);
      } else {
        setEntries(updatedEntries);
        setShowNoSearchResults(true);
      }
    } else {
      setShowNoSearchResults(false);
      setEntries(entries);
    }
  };

  return (
    <div id={styles.searchContainer}>
      <input
        type="text"
        className={styles.searchInput}
        placeholder="Search..."
        onChange={(event) => {
          handleSearch(event.target.value);
        }}
      />
      <button className={styles.searchButton}>🔍</button>
    </div>
  );
};

export default PostSearchBar;

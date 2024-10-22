import styles from './styles.module.css';

const PostSearchBar = () => {
    return (
        <div id={styles.searchContainer}>
            <input
                type="text"
                className={styles.searchInput}
                placeholder="Search..."
            />
            <button className={styles.searchButton}>
                🔍
            </button>
        </div>
    );
};

export default PostSearchBar;

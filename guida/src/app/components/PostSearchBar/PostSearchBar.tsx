import styles from './styles.module.css';

const PostSearchBar = () => {
    return (
        <div className={styles.searchContainer}>
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

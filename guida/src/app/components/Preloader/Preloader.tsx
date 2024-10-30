import styles from "./styles.module.css";

export default function Preloader() {
  return (
    <div className={styles.loaderContainer}>
      <div className={styles.bouncingDots}>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  );
}

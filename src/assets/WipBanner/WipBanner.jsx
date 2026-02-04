import styles from "./WipBanner.module.css";

function WipBanner() {
    return (
        <div className={styles.banner}>
            <span className={styles.text}>
                🚧 Site under construction, some features may be incomplete or subject to change! 🛠️
            </span>
        </div>
    );
}

export default WipBanner;

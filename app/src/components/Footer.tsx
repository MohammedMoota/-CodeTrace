import styles from "./Footer.module.css";

interface FooterProps {
    onReplay: () => void;
}

export default function Footer({ onReplay }: FooterProps) {
    return (
        <footer className={styles.footer}>
            <div className={styles.container}>
                <div className={styles.branding}>
                    <strong>CodeTrace™</strong>
                    <span>The Debugging Manual</span>
                    <span className={styles.powered}>Powered by Gemini 1.5</span>
                </div>
                <div className={styles.actions}>
                    <button className={styles.button} onClick={onReplay}>
                        [ Replay Intro ]
                    </button>
                </div>
                <div className={styles.version}>v1.0.0</div>
            </div>
        </footer>
    );
}

"use client";

import { useEffect, useRef, useCallback } from "react";
import styles from "./Sidebar.module.css";

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
    const sidebarRef = useRef<HTMLElement>(null);

    useEffect(() => {
        if (!isOpen) return;
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        document.addEventListener("keydown", handleEscape);
        return () => document.removeEventListener("keydown", handleEscape);
    }, [isOpen, onClose]);

    const handleClickOutside = useCallback(
        (e: MouseEvent) => {
            // Ignore clicks on the toggle button itself (handled by its own onClick)
            if ((e.target as Element).closest("#sidebar-toggle-btn")) return;

            if (sidebarRef.current && !sidebarRef.current.contains(e.target as Node)) {
                onClose();
            }
        },
        [onClose]
    );

    useEffect(() => {
        if (!isOpen) return;
        const timer = setTimeout(() => {
            document.addEventListener("mousedown", handleClickOutside);
        }, 100);
        return () => {
            clearTimeout(timer);
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen, handleClickOutside]);

    return (
        <>
            <div className={`${styles.overlay} ${isOpen ? styles.visible : ""}`} />
            <aside
                ref={sidebarRef}
                className={`${styles.sidebar} ${isOpen ? styles.open : ""}`}
                role="navigation"
            >
                <header className={styles.header}>
                    <h1 className={styles.logo}>
                        Code<strong>Trace</strong>
                    </h1>
                </header>
                <hr className={styles.divider} />
                <button className={styles.closeBtn} onClick={onClose}>
                    [ ✕ CLOSE ]
                </button>
                <hr className={styles.divider} />
                <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>/ Recent Analysis</h2>
                    <p className={styles.empty}>// No logs found</p>
                </section>
                <hr className={styles.divider} />
                <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>/ Manual</h2>
                    <div className={styles.manual}>
                        <code>[01]</code> Upload codebase<br />
                        <code>[02]</code> Upload evidence<br />
                        <code>[03]</code> Add context<br />
                        <code>[04]</code> Initialize scan
                    </div>
                </section>
                <footer className={styles.footer}>
                    <span>v1.0.0 | CodeTrace™</span>
                </footer>
            </aside>
        </>
    );
}

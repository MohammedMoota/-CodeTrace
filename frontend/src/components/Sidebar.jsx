/**
 * Sidebar Component
 * 
 * Collapsible navigation panel with:
 * - Close on button click
 * - Close on Escape key
 * - Close on click outside
 * - Smooth slide animation
 */

import { useEffect, useRef, useCallback } from 'react';
import { APP_INFO } from '../constants';
import './Sidebar.css';

/**
 * @param {Object} props
 * @param {boolean} props.isOpen - Whether sidebar is visible
 * @param {Function} props.onClose - Callback to close sidebar
 */
function Sidebar({ isOpen, onClose }) {
    const sidebarRef = useRef(null);

    // =========================================================================
    // Keyboard Navigation (Escape to close)
    // =========================================================================
    useEffect(() => {
        if (!isOpen) return;

        const handleEscape = (e) => {
            if (e.key === 'Escape') onClose();
        };

        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [isOpen, onClose]);

    // =========================================================================
    // Click Outside to Close
    // =========================================================================
    const handleClickOutside = useCallback((e) => {
        if (sidebarRef.current && !sidebarRef.current.contains(e.target)) {
            onClose();
        }
    }, [onClose]);

    useEffect(() => {
        if (!isOpen) return;

        // Delay adding listener to prevent immediate close
        const timer = setTimeout(() => {
            document.addEventListener('mousedown', handleClickOutside);
        }, 100);

        return () => {
            clearTimeout(timer);
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen, handleClickOutside]);

    // =========================================================================
    // Render
    // =========================================================================
    return (
        <>
            {/* Backdrop overlay */}
            <div
                className={`sidebar-overlay ${isOpen ? 'visible' : ''}`}
                aria-hidden="true"
            />

            {/* Sidebar panel */}
            <aside
                ref={sidebarRef}
                className={`sidebar ${isOpen ? 'open' : ''}`}
                aria-hidden={!isOpen}
                role="navigation"
            >
                {/* Header */}
                <header className="sidebar-header">
                    <h1 className="sidebar-logo">
                        Code<strong>Trace</strong>
                    </h1>
                </header>

                <hr className="sidebar-divider" />

                {/* Close Button */}
                <button className="sidebar-close" onClick={onClose}>
                    [ ✕ CLOSE ]
                </button>

                <hr className="sidebar-divider" />

                {/* History Section */}
                <section className="sidebar-section">
                    <h2 className="sidebar-section-title">/ RECENT ANALYSIS</h2>
                    <p className="sidebar-empty">// No logs found</p>
                </section>

                <hr className="sidebar-divider" />

                {/* Quick Guide */}
                <section className="sidebar-section">
                    <h2 className="sidebar-section-title">/ MANUAL</h2>
                    <div className="sidebar-manual">
                        <code>[01]</code> Upload codebase<br />
                        <code>[02]</code> Upload evidence<br />
                        <code>[03]</code> Add context<br />
                        <code>[04]</code> Initialize scan
                    </div>
                </section>

                {/* Footer */}
                <footer className="sidebar-footer">
                    <span>v{APP_INFO.VERSION} | {APP_INFO.NAME}™</span>
                </footer>
            </aside>
        </>
    );
}

export default Sidebar;

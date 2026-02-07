/**
 * Footer Component
 * 
 * Application footer with branding and navigation.
 */

import { APP_INFO } from '../constants';
import './Footer.css';

/**
 * @param {Function} props.onReplay - Callback to replay the hero animation
 */
function Footer({ onReplay }) {
    return (
        <footer className="footer">
            <div className="footer-container">
                {/* Branding */}
                <div className="footer-branding">
                    <strong>{APP_INFO.NAME}™</strong>
                    <span>{APP_INFO.TAGLINE}</span>
                    <span className="footer-powered">Powered by {APP_INFO.POWERED_BY}</span>
                </div>

                {/* Actions */}
                <div className="footer-actions">
                    <button className="footer-button" onClick={onReplay}>
                        [ REPLAY INTRO ]
                    </button>
                </div>

                {/* Version */}
                <div className="footer-version">
                    v{APP_INFO.VERSION}
                </div>
            </div>
        </footer>
    );
}

export default Footer;

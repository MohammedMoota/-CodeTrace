/**
 * CodeTrace - AI-Powered Bug Detection Tool
 * 
 * Main Application Component
 */

import { useState, useCallback, useRef } from 'react';
import { useScrollPosition, useHeroMessages } from './hooks';

// Components
import Sidebar from './components/Sidebar';
import UploadSection from './components/UploadSection';
import Footer from './components/Footer';

// Styles
import './App.css';

function App() {
  // State
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [heroComplete, setHeroComplete] = useState(false);
  const heroIframeRef = useRef(null);

  // Hooks
  const { isNearBottom } = useScrollPosition();
  const showToggle = heroComplete && isNearBottom;

  useHeroMessages(
    useCallback(() => setHeroComplete(true), []),
    useCallback(() => setHeroComplete(false), [])
  );

  // Replay hero animation
  const handleReplayIntro = useCallback(() => {
    setHeroComplete(false);
    if (heroIframeRef.current) {
      heroIframeRef.current.src = heroIframeRef.current.src;
    }
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  return (
    <div className="app">
      {/* Sidebar Toggle */}
      <button
        className={`sidebar-toggle ${showToggle ? 'visible' : ''}`}
        onClick={() => setSidebarOpen(true)}
        aria-label="Open menu"
      >
        ☰
      </button>

      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Hero Animation */}
      <div className={`hero-frame ${heroComplete ? 'hidden' : ''}`}>
        <iframe
          ref={heroIframeRef}
          src="/hero.html"
          title="CodeTrace Introduction"
          className="hero-iframe"
        />
      </div>

      {/* Main Content */}
      <main className={`main-content ${heroComplete ? 'visible' : ''}`}>
        <UploadSection />
        <Footer onReplay={handleReplayIntro} />
      </main>
    </div>
  );
}

export default App;

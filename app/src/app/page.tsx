"use client";

import { useState, useCallback, useEffect } from "react";
import Hero from "@/components/Hero";
import UploadSection from "@/components/UploadSection";
import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";
import styles from "./page.module.css";

export default function Home() {
  const [heroComplete, setHeroComplete] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Force scroll to top on load/refresh to ensure the experience starts from 0
  useEffect(() => {
    // Disable browser scroll restoration
    if (typeof window !== "undefined" && "scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }

    // Force top
    window.scrollTo(0, 0);

    // Re-enable auto restoration when leaving? 
    // Usually for SPA it's fine to keep manual or reset on unmount, 
    // but here we just want to ensure THIS page starts at top.
  }, []);

  const handleHeroComplete = useCallback(() => {
    setHeroComplete(true);
  }, []);

  const handleReplay = useCallback(() => {
    setHeroComplete(false);
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });

    // Minimal delay to ensure state updates before forcing scroll again if needed
    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 10);
  }, []);

  return (
    <div className={styles.app}>
      {/* Sidebar */}
      <button
        className={`${styles.sidebarToggle} ${heroComplete ? styles.visible : ""} ${sidebarOpen ? styles.open : ""}`}
        onClick={() => setSidebarOpen((prev) => !prev)}
        aria-label={sidebarOpen ? "Close menu" : "Open menu"}
        id="sidebar-toggle-btn"
      >
        {sidebarOpen ? "✕" : "☰"}
      </button>
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Hero */}
      <Hero onComplete={handleHeroComplete} />

      {/* Content (below hero) */}
      {/* We render this but maybe hide it visually or just let it exist? 
          Actually, conditionally rendering it is fine, but if the user scrolls fast, 
          we want it to be there. 
          The previous logic waits for onComplete (99% scroll).
      */}
      {heroComplete && (
        <main className={styles.main}>
          <UploadSection />
          <Footer onReplay={handleReplay} />
        </main>
      )}
    </div>
  );
}

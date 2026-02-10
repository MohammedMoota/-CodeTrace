"use client";

import { useRef, useEffect, useState } from "react";
import styles from "./Hero.module.css";

const WORDS = [
    ["CodeTrace", "is", "the"],
    ["intersection", "of", "AI*"],
    ["and", "video analysis*", "to", "form"],
    ["intelligent debugging*"],
    ["that", "finds", "the", "root cause.*"],
];

// Easing function for smoother feel (ease-out cubic)
const easeOutCubic = (x: number): number => {
    return 1 - Math.pow(1 - x, 3);
};

interface HeroProps {
    onComplete: () => void;
}

export default function Hero({ onComplete }: HeroProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [progress, setProgress] = useState(0);

    // === ANIMATION PHASES (Adjusted for better pacing) ===
    // 0.00 - 0.20: Hero Shrink (20%)
    // 0.20 - 0.40: Reveal Container Entry (20%)
    // 0.40 - 0.70: Text Stagger (30% - longer for reading)
    // 0.70 - 0.90: About Section Entry (20%)
    // 0.90 - 1.00: Final Done State (10%)

    // Helper to map global progress to a local phase (0 to 1)
    const getPhase = (start: number, end: number) => {
        return Math.min(1, Math.max(0, (progress - start) / (end - start)));
    };

    const p1_HeroShrink = getPhase(0, 0.2);
    const p2_RevealEnter = getPhase(0.2, 0.4);
    const p3_TextReveal = getPhase(0.4, 0.7);
    const p4_AboutEnter = getPhase(0.7, 0.9);
    const p5_Done = getPhase(0.9, 1.0);

    useEffect(() => {
        const handleScroll = () => {
            if (!containerRef.current) return;
            const rect = containerRef.current.getBoundingClientRect();
            const windowHeight = window.innerHeight;
            const totalDist = rect.height - windowHeight;

            if (totalDist <= 0) return;

            // Calculate raw scroll progress (0 to 1)
            let rawP = -rect.top / totalDist;
            rawP = Math.max(0, Math.min(1, rawP));

            // Apply easing for a more "professional" feel
            // We mix raw linear progress with eased progress for control
            // const easedP = easeOutCubic(rawP); 
            // Actually, linear mapping usually feels most "precise" for scroll-linked animations
            // because it 1:1 tracks your finger. Easing can make it feel "floaty" or "disconnected".
            // Let's stick to linear but improved phase distribution.

            setProgress(rawP);

            if (rawP >= 0.99) {
                onComplete();
            }
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        window.addEventListener("resize", handleScroll);
        handleScroll();

        return () => {
            window.removeEventListener("scroll", handleScroll);
            window.removeEventListener("resize", handleScroll);
        };
    }, [onComplete]);

    // --- DERIVED STYLES ---

    // Phase 1: Hero Shrink
    const heroScale = 100 - p1_HeroShrink * 65; // 100 -> 35
    const heroR = p1_HeroShrink * 12; // Radius
    const titleLeftY = -p1_HeroShrink * 300;
    const titleRightX = p1_HeroShrink * 200;
    const iconRot = p1_HeroShrink * 180;
    // Fade out hero content faster so it's gone before card gets too small
    const heroOpacity = 1 - p1_HeroShrink * 1.5;

    // Phase 2: Reveal Entry
    const dialRot = (p2_RevealEnter + p3_TextReveal) * 180; // Rotate during enter AND reveal
    const revealY = (1 - p2_RevealEnter) * 100; // Slide up

    // Phase 3: Text Stagger
    const totalWords = WORDS.flat().length;
    // Reveal words progressively
    const visibleWordCount = Math.floor(p3_TextReveal * (totalWords + 1));

    // Phase 4: About Entry
    const aboutY = (1 - p4_AboutEnter) * 100; // Slide up

    // Phase 5: Done
    const doneOpacity = p5_Done;

    let wordIndex = 0;

    return (
        <div ref={containerRef} className={styles.scrollContainer}>
            <div className={styles.stickyViewport}>

                {/* --- LAYER 1: HERO CARD --- */}
                <div className={styles.heroWrapper} style={{ pointerEvents: 'none' }}>
                    {/* Background behind card to hide previous content if helpful, though main bg is black */}
                    <div
                        className={styles.heroCard}
                        style={{
                            width: `${heroScale}%`,
                            height: `${heroScale}%`,
                            borderRadius: `${heroR}px`,
                            willChange: "width, height, border-radius"
                        }}
                    >
                        <div className={styles.heroTop}>
                            <span>CHAPTER 1:</span>
                            <span>ABOUT</span>
                        </div>

                        <div className={styles.heroContent}>
                            <div
                                className={styles.titleLeft}
                                style={{
                                    transform: `translateY(${titleLeftY}px)`,
                                    opacity: Math.max(0, heroOpacity),
                                    willChange: "transform, opacity"
                                }}
                            >
                                DEBUGGING
                            </div>
                            <div
                                className={styles.centerIcon}
                                style={{ transform: `rotate(${iconRot}deg)` }}
                            >
                                +
                            </div>
                            <div
                                className={styles.titleRight}
                                style={{
                                    transform: `translateX(${titleRightX}px)`,
                                    opacity: Math.max(0, heroOpacity),
                                    willChange: "transform, opacity"
                                }}
                            >
                                <span className={styles.highlightBg}>&lt;/ANALYSIS&gt;</span>
                            </div>
                        </div>

                        <div
                            className={styles.heroBottom}
                            onClick={() => window.scrollBy({ top: window.innerHeight, behavior: 'smooth' })}
                            style={{ cursor: 'pointer' }}
                        >
                            <span>SCROLL TO INITIALIZE</span>
                            <span>↓</span>
                        </div>
                    </div>
                </div>

                {/* --- LAYER 2: REVEAL --- */}
                <div
                    className={styles.revealWrapper}
                    style={{
                        transform: `translateY(${revealY}vh)`,
                        willChange: "transform"
                    }}
                >
                    <div
                        className={styles.dialBg}
                        style={{ transform: `rotate(${dialRot}deg)` }}
                    >
                        {Array.from({ length: 60 }, (_, i) => (
                            <div
                                key={i}
                                className={styles.dialTick}
                                style={{
                                    transform: `rotate(${i * 6}deg)`,
                                    height: i % 5 === 0 ? "22px" : undefined,
                                    background: i % 5 === 0 ? "#c8ff00" : undefined,
                                }}
                            />
                        ))}
                    </div>

                    <div className={styles.revealTextContent}>
                        {WORDS.map((line, lineIdx) => (
                            <div key={lineIdx} className={styles.textLine}>
                                {line.map((word, wIdx) => {
                                    const idx = wordIndex++;
                                    const isHighlight = word.endsWith("*");
                                    const cleanWord = isHighlight ? word.slice(0, -1) : word;
                                    const isRevealed = idx < visibleWordCount;

                                    return (
                                        <span key={wIdx} className={`${styles.wordWrap} ${isRevealed ? styles.revealed : ""}`}>
                                            <span className={`${styles.wordText} ${isHighlight ? styles.highlight : ""}`}>
                                                {cleanWord}
                                            </span>
                                            <div className={styles.mask} />
                                        </span>
                                    );
                                })}
                            </div>
                        ))}
                    </div>
                </div>

                {/* --- LAYER 3: ABOUT --- */}
                <div
                    className={styles.aboutWrapper}
                    style={{
                        transform: `translateY(${aboutY}vh)`,
                        willChange: "transform"
                    }}
                >
                    <div className={styles.aboutBadge}>
                        <span className={styles.aboutDot} />
                        <span>ABOUT</span>
                    </div>
                    <div className={styles.aboutContent}>
                        <p className={styles.aboutText}>
                            This project is dedicated to the methodology behind debugging code that pushes
                            boundaries. Our process values curiosity, iteration, and experimentation.
                        </p>
                    </div>
                </div>

                {/* --- LAYER 4: DONE --- */}
                <div
                    className={styles.doneWrapper}
                    style={{
                        opacity: doneOpacity,
                        pointerEvents: doneOpacity > 0.5 ? 'auto' : 'none'
                    }}
                >
                    <div className={styles.doneTitle}>READY TO DEBUG</div>
                    <div className={styles.doneSubtitle}>Scroll down to continue</div>
                    <div className={styles.doneArrow}>↓</div>
                </div>

                {/* PROGRESS INDICATOR */}
                <div className={styles.progressContainer}>
                    <div className={styles.progressText}>
                        {progress < 0.2 ? "CHAPTER 01" :
                            progress < 0.7 ? "CHAPTER 02" :
                                progress < 0.9 ? "ABOUT" : "READY"}
                    </div>
                    <div className={styles.progressTrack}>
                        <div
                            className={styles.progressFill}
                            style={{ width: `${progress * 100}%` }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

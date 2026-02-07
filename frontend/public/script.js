/**
 * CodeTrace - Hero Animation Script
 * 
 * Multi-phase scroll-driven animation:
 * - Phase 1: Hero shrinks as user scrolls
 * - Phase 2: Text reveal animation
 * - Phase 3: About section slides up
 * - Phase 4: Ready state with completion signal
 * 
 * Note: Scroll-back (replay) is handled by React app, not here.
 */

// =============================================================================
// Configuration
// =============================================================================

const CONFIG = {
    HERO_SHRINK: 800,
    REVEAL_ENTER: 1200,
    REVEAL_ANIM: 1400,
    ABOUT_ENTER: 1200,
    READY_BUFFER: 800,
    LERP_FACTOR: 0.1,
    SCROLL_SENSITIVITY: 0.8,
};

const CP = {
    1: CONFIG.HERO_SHRINK,
    2: CONFIG.HERO_SHRINK + CONFIG.REVEAL_ENTER,
    3: CONFIG.HERO_SHRINK + CONFIG.REVEAL_ENTER + CONFIG.REVEAL_ANIM,
    4: CONFIG.HERO_SHRINK + CONFIG.REVEAL_ENTER + CONFIG.REVEAL_ANIM + CONFIG.ABOUT_ENTER,
    5: CONFIG.HERO_SHRINK + CONFIG.REVEAL_ENTER + CONFIG.REVEAL_ANIM + CONFIG.ABOUT_ENTER + CONFIG.READY_BUFFER,
};

// =============================================================================
// State
// =============================================================================

let targetY = 0;
let currentY = 0;
let isLocked = true;

// =============================================================================
// DOM Elements
// =============================================================================

const DOM = {
    heroWrapper: document.querySelector('.hero-wrapper'),
    heroContainer: document.querySelector('.hero-container'),
    titleLeft: document.querySelector('.title-left'),
    titleRight: document.querySelector('.title-right'),
    centerIcon: document.querySelector('.center-icon'),
    revealWrapper: document.querySelector('.reveal-wrapper'),
    dialBg: document.querySelector('.dial-bg'),
    wordWraps: document.querySelectorAll('.word-wrap'),
    aboutWrapper: document.querySelector('.about-wrapper'),
    doneWrapper: document.querySelector('.done-wrapper'),
    progressFill: document.querySelector('.progress-fill'),
    progressText: document.querySelector('.progress-text'),
};

// =============================================================================
// Initialization
// =============================================================================

function init() {
    generateDialTicks();
    setInitialState();
    window.addEventListener('wheel', handleScroll, { passive: false });
    requestAnimationFrame(animationLoop);
}

function generateDialTicks() {
    for (let i = 0; i < 60; i++) {
        const tick = document.createElement('div');
        tick.className = 'dial-tick';
        tick.style.transform = `rotate(${i * 6}deg)`;
        if (i % 5 === 0) {
            tick.style.height = '22px';
            tick.style.background = '#c8ff00';
        }
        DOM.dialBg.appendChild(tick);
    }
}

function setInitialState() {
    DOM.revealWrapper.style.transform = 'translateY(100vh)';
    DOM.revealWrapper.style.opacity = '1';
    DOM.aboutWrapper.style.transform = 'translateY(100vh)';
    DOM.aboutWrapper.style.opacity = '1';
    document.body.style.transform = 'translateY(0)';
}

// =============================================================================
// Animation Loop
// =============================================================================

function animationLoop() {
    const diff = targetY - currentY;

    if (Math.abs(diff) > 0.5) {
        currentY += diff * CONFIG.LERP_FACTOR;
    } else {
        currentY = targetY;
    }

    updateAnimation(currentY);

    if (isLocked && currentY > CP[5]) {
        completeAnimation();
    }

    if (isLocked || Math.abs(diff) > 0.5) {
        requestAnimationFrame(animationLoop);
    }
}

// =============================================================================
// Scroll Handler (only forward scrolling in hero)
// =============================================================================

function handleScroll(e) {
    if (!isLocked) return;

    e.preventDefault();
    targetY += e.deltaY * CONFIG.SCROLL_SENSITIVITY;
    targetY = Math.max(0, targetY);
    requestAnimationFrame(animationLoop);
}

// =============================================================================
// Phase Updates
// =============================================================================

function updateAnimation(y) {
    if (y <= CP[1]) updatePhase1(y);
    else if (y <= CP[2]) updatePhase2Enter(y);
    else if (y <= CP[3]) updatePhase2Anim(y);
    else if (y <= CP[4]) updatePhase3(y);
    else updatePhase4(y);
}

function updatePhase1(y) {
    const p = Math.min(1, y / CONFIG.HERO_SHRINK);
    DOM.heroWrapper.style.opacity = '1';
    DOM.doneWrapper.classList.remove('active');

    const size = 100 - (p * 65);
    DOM.heroContainer.style.width = `${size}%`;
    DOM.heroContainer.style.height = `${size}%`;

    DOM.centerIcon.style.transform = `translate(-50%, -50%) rotate(${p * 180}deg)`;
    DOM.titleLeft.style.transform = `translateY(-${p * 300}px)`;
    DOM.titleLeft.style.opacity = Math.max(0, 1 - p * 1.5);
    DOM.titleRight.style.transform = `translateX(${p * 200}px)`;
    DOM.titleRight.style.opacity = Math.max(0, 1 - p * 1.5);

    DOM.revealWrapper.style.transform = 'translateY(100vh)';
    DOM.aboutWrapper.style.transform = 'translateY(100vh)';
    updateProgress('CHAPTER 01', p * 20);
}

function updatePhase2Enter(y) {
    const p = (y - CP[1]) / CONFIG.REVEAL_ENTER;
    DOM.revealWrapper.style.transform = `translateY(${(1 - p) * 100}vh)`;
    DOM.aboutWrapper.style.transform = 'translateY(100vh)';
    DOM.doneWrapper.classList.remove('active');
    DOM.wordWraps.forEach(w => w.classList.remove('revealed'));
    updateProgress('CHAPTER 02', 20 + (p * 20));
}

function updatePhase2Anim(y) {
    const p = (y - CP[2]) / CONFIG.REVEAL_ANIM;
    DOM.revealWrapper.style.transform = 'translateY(0)';
    const count = Math.floor(p * (DOM.wordWraps.length + 1));
    DOM.wordWraps.forEach((wrap, i) => wrap.classList.toggle('revealed', i < count));
    DOM.dialBg.style.transform = `rotate(${p * 180}deg)`;
    DOM.aboutWrapper.style.transform = 'translateY(100vh)';
    DOM.doneWrapper.classList.remove('active');
    updateProgress('ANALYSIS', 40 + (p * 20));
}

function updatePhase3(y) {
    const p = (y - CP[3]) / CONFIG.ABOUT_ENTER;
    DOM.revealWrapper.style.transform = 'translateY(0)';
    DOM.wordWraps.forEach(w => w.classList.add('revealed'));
    DOM.aboutWrapper.style.transform = `translateY(${(1 - p) * 100}vh)`;
    DOM.doneWrapper.classList.remove('active');
    updateProgress('ABOUT', 60 + (p * 20));
}

function updatePhase4(y) {
    DOM.aboutWrapper.style.transform = 'translateY(0)';
    DOM.doneWrapper.classList.add('active');
    const p = Math.min(1, (y - CP[4]) / CONFIG.READY_BUFFER);
    updateProgress('INITIALIZING', 80 + (p * 20));
}

function updateProgress(text, percent) {
    DOM.progressText.textContent = text;
    DOM.progressFill.style.width = `${percent}%`;
}

// =============================================================================
// Completion (signals React app)
// =============================================================================

function completeAnimation() {
    if (!isLocked) return;
    isLocked = false;

    updateProgress('READY', 100);

    document.body.style.transition = 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
    document.body.style.transform = 'translateY(-100vh)';

    setTimeout(() => {
        window.parent?.postMessage('hero-complete', '*');
    }, 600);
}

// =============================================================================
// Start
// =============================================================================

init();

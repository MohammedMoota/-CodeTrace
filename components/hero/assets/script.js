// Hero Animation Script - ROBUST SMOOTH SCROLL & RE-ENTRY
// Phase 1: Hero locks and shrinks
// Phase 2: Reveal Section slides up
// Phase 3: About Section slides up
// Phase 4: Ready State (Buffer)
// Unlock: Slides away
// Re-entry: Robust listener

// Scroll Constants (Pixels)
const S_HERO_SHRINK = 800;
const S_REVEAL_ENTER = 1200;
const S_REVEAL_ANIM = 1400;
const S_ABOUT_ENTER = 1200;
const S_READY_BUFFER = 1000;

// Cumulative checkpoints
const CP_1 = S_HERO_SHRINK;
const CP_2 = CP_1 + S_REVEAL_ENTER;
const CP_3 = CP_2 + S_REVEAL_ANIM;
const CP_4 = CP_3 + S_ABOUT_ENTER;
// Increase buffer slightly to prevent accidental exits vs scroll bounce
const CP_5 = CP_4 + S_READY_BUFFER;

// State
let targetY = 0;
let currentY = 0;
let isLocked = true;

const dom = {
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
    progressText: document.querySelector('.progress-text')
};

// Generate dial ticks
for (let i = 0; i < 60; i++) {
    const tick = document.createElement('div');
    tick.className = 'dial-tick';
    tick.style.transform = `rotate(${i * 6}deg)`;
    if (i % 5 === 0) {
        tick.style.height = '22px';
        tick.style.background = '#38bdf8';
    }
    dom.dialBg.appendChild(tick);
}

// Initial State
dom.revealWrapper.style.transform = 'translateY(100vh)';
dom.revealWrapper.style.opacity = '1';
dom.aboutWrapper.style.transform = 'translateY(100vh)';
dom.aboutWrapper.style.opacity = '1';

// Animation Loop
function animationLoop() {
    // Lerp
    const diff = targetY - currentY;

    if (Math.abs(diff) > 0.5) {
        currentY += diff * 0.08;
    } else {
        currentY = targetY;
    }

    updateAnimation(currentY);

    // START UNLOCK LOGIC
    // We only unlock if currentY passes CP_5 AND isLocked is true
    if (isLocked && currentY > CP_5) {
        unlockScroll();
    }
    // END UNLOCK LOGIC

    if (isLocked || Math.abs(diff) > 0.5) {
        requestAnimationFrame(animationLoop);
    }
}
requestAnimationFrame(animationLoop);


// === PARENT WINDOW RE-ENTRY LISTENER ===
// Robustly find the scrolling container in Streamlit
try {
    if (window.parent) {
        const doc = window.parent.document;

        // Target specific Streamlit containers
        const containers = [
            doc.querySelector('[data-testid="stAppViewContainer"]'), // Primary Streamlit scroll
            doc.querySelector('.main'),
            doc.body,
            doc.documentElement
        ];

        // Helper to check if we are at top
        const isAtTop = (el) => {
            if (!el) return false;
            return el.scrollTop < 50; // Increased threshold
        };

        const onParentScroll = (e) => {
            if (isLocked) return; // If already locked, ignore

            // Only care about scrolling UP (negative delta)
            if (e.deltaY >= 0) return;

            // Check if ANY valid container is at the top
            let atTop = false;
            for (const c of containers) {
                if (c && isAtTop(c)) {
                    atTop = true;
                    break;
                }
            }

            if (atTop) {
                // Trigger Re-lock
                e.preventDefault();
                relockScroll();
            }
        };

        // Attach to Window to capture all bubbles
        window.parent.addEventListener('wheel', onParentScroll, { passive: false });
    }
} catch (e) {
    console.log("Parent access error:", e);
}


// Main scroll handler (internal)
window.addEventListener('wheel', (e) => {
    if (!isLocked) return;

    e.preventDefault();

    // Update target
    targetY += e.deltaY;
    targetY = Math.max(0, targetY);

    // Restart loop if needed
    requestAnimationFrame(animationLoop);

}, { passive: false });


function updateAnimation(y) {
    // === PHASE 1: HERO SHRINK ===
    if (y <= CP_1) {
        const p = Math.min(1, y / S_HERO_SHRINK);

        dom.heroWrapper.style.opacity = '1';
        dom.doneWrapper.classList.remove('active');

        const size = 100 - (p * 65);
        dom.heroContainer.style.width = `${size}%`;
        dom.heroContainer.style.height = `${size}%`;

        dom.centerIcon.style.transform = `translate(-50%, -50%) rotate(${p * 180}deg)`;
        dom.titleLeft.style.transform = `translateY(-${p * 300}px)`;
        dom.titleLeft.style.opacity = Math.max(0, 1 - p * 1.5);
        dom.titleRight.style.transform = `translateX(${p * 200}px)`;
        dom.titleRight.style.opacity = Math.max(0, 1 - p * 1.5);

        dom.revealWrapper.style.transform = 'translateY(100vh)';
        dom.aboutWrapper.style.transform = 'translateY(100vh)';

        dom.progressText.textContent = "CHAPTER 01";
        dom.progressFill.style.width = `${p * 20}%`;
    }

    // === PHASE 2 ENTER: REVEAL SLIDES UP ===
    else if (y <= CP_2) {
        const progress = (y - CP_1) / S_REVEAL_ENTER;
        const translateY = (1 - progress) * 100;

        dom.revealWrapper.style.transform = `translateY(${translateY}vh)`;
        dom.revealWrapper.style.opacity = '1';
        dom.aboutWrapper.style.transform = 'translateY(100vh)';
        dom.doneWrapper.classList.remove('active');

        dom.wordWraps.forEach(w => w.classList.remove('revealed'));

        dom.progressText.textContent = "CHAPTER 02";
        dom.progressFill.style.width = `${20 + (progress * 20)}%`;
    }

    // === PHASE 2 ANIM: TEXT REVEAL ===
    else if (y <= CP_3) {
        const progress = (y - CP_2) / S_REVEAL_ANIM;

        dom.revealWrapper.style.transform = `translateY(0)`;

        const total = dom.wordWraps.length;
        const count = Math.floor(progress * (total + 1));
        dom.wordWraps.forEach((wrap, i) => {
            if (i < count) wrap.classList.add('revealed');
            else wrap.classList.remove('revealed');
        });
        dom.dialBg.style.transform = `rotate(${progress * 180}deg)`;
        dom.aboutWrapper.style.transform = 'translateY(100vh)';
        dom.doneWrapper.classList.remove('active');

        dom.progressText.textContent = "ANALYSIS";
        dom.progressFill.style.width = `${40 + (progress * 20)}%`;
    }

    // === PHASE 3 ENTER: ABOUT SLIDES UP ===
    else if (y <= CP_4) {
        const progress = (y - CP_3) / S_ABOUT_ENTER;

        dom.revealWrapper.style.transform = `translateY(0)`;
        dom.wordWraps.forEach(w => w.classList.add('revealed'));

        const translateY = (1 - progress) * 100;
        dom.aboutWrapper.style.transform = `translateY(${translateY}vh)`;
        dom.aboutWrapper.style.opacity = '1';
        dom.doneWrapper.classList.remove('active');

        dom.progressText.textContent = "ABOUT";
        dom.progressFill.style.width = `${60 + (progress * 20)}%`;
    }

    // === PHASE 4: READY BUFFER ===
    else {
        // Buffer zone
        dom.aboutWrapper.style.transform = `translateY(0)`;
        dom.doneWrapper.classList.add('active');

        const p = Math.min(1, (y - CP_4) / S_READY_BUFFER);
        dom.progressText.textContent = "INITIALIZING";
        dom.progressFill.style.width = `${80 + (p * 20)}%`;
    }
}

function unlockScroll() {
    if (!isLocked) return;

    isLocked = false;
    dom.progressText.textContent = "READY";
    dom.progressFill.style.width = '100%';

    if (window.frameElement) {
        // Slide out naturally
        window.frameElement.style.transition = 'transform 0.8s cubic-bezier(0.65, 0, 0.35, 1)';
        window.frameElement.style.transform = 'translateY(-100vh)';
        window.frameElement.style.pointerEvents = 'none';
    }
}

function relockScroll() {
    isLocked = true;

    // Set target inside buffer to animate slightly
    targetY = CP_5 - 200;
    // Force currentY if it was far off? No, lerp handles it.

    if (window.frameElement) {
        window.frameElement.style.transition = 'transform 0.6s cubic-bezier(0.22, 1, 0.36, 1)';
        window.frameElement.style.transform = 'translateY(0)';
        window.frameElement.style.pointerEvents = 'auto'; // Re-enable pointer logic
    }

    requestAnimationFrame(animationLoop);
}

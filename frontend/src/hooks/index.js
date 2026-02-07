/**
 * CodeTrace - Custom React Hooks
 * 
 * Reusable hooks for scroll tracking and hero communication.
 */

import { useState, useEffect, useCallback } from 'react';
import { UI } from '../constants';

/**
 * Hook to track scroll position and determine if user is near bottom of page.
 */
export function useScrollPosition(threshold = UI.TOGGLE_VISIBILITY_THRESHOLD) {
    const [isNearBottom, setIsNearBottom] = useState(false);
    const [scrollY, setScrollY] = useState(0);

    const handleScroll = useCallback(() => {
        const currentScrollY = window.scrollY;
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;
        const distanceFromBottom = documentHeight - currentScrollY - windowHeight;

        setScrollY(currentScrollY);
        setIsNearBottom(distanceFromBottom < threshold);
    }, [threshold]);

    useEffect(() => {
        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();
        return () => window.removeEventListener('scroll', handleScroll);
    }, [handleScroll]);

    return { isNearBottom, scrollY };
}

/**
 * Hook to listen for messages from iframe (hero animation).
 */
export function useHeroMessages(onComplete, onRelock) {
    useEffect(() => {
        const handleMessage = (event) => {
            if (event.data === 'hero-complete' && onComplete) {
                onComplete();
            } else if (event.data === 'hero-relock' && onRelock) {
                onRelock();
            }
        };

        window.addEventListener('message', handleMessage);
        return () => window.removeEventListener('message', handleMessage);
    }, [onComplete, onRelock]);
}

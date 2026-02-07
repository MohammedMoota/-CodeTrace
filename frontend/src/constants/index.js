/**
 * CodeTrace - AI-Powered Bug Detection Tool
 * 
 * Application Constants
 * Contains all configurable values used throughout the app.
 */

// =============================================================================
// API Configuration
// =============================================================================
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// =============================================================================
// UI Configuration
// =============================================================================
export const UI = {
    // Sidebar toggle appears when user is within this distance (px) from bottom
    TOGGLE_VISIBILITY_THRESHOLD: 400,

    // Animation durations (ms)
    ANIMATION_DURATION: 300,
    HERO_SLIDE_DURATION: 600,
};

// =============================================================================
// File Upload Configuration
// =============================================================================
export const UPLOAD = {
    // Maximum file size in bytes (200MB)
    MAX_FILE_SIZE: 200 * 1024 * 1024,

    // Accepted file types
    CODE_EXTENSIONS: ['.zip'],
    VIDEO_EXTENSIONS: ['.mp4', '.mov', '.avi', '.webm', '.mpeg4'],
};

// =============================================================================
// App Metadata
// =============================================================================
export const APP_INFO = {
    NAME: 'CodeTrace',
    VERSION: '1.0.0',
    TAGLINE: 'The Debugging Manual',
    POWERED_BY: 'Gemini 1.5',
};

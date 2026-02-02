"""
Hero Component
Renders the main hero section for the application.
"""
import streamlit as st


def render_hero():
    """Render the hero section with title, description, and feature tags."""
    
    st.markdown("""
    <div class="hero">
        <span class="hero-badge">AI-Powered Debugging</span>
        <h1 class="hero-title">CodeTrace</h1>
        <p class="hero-subtitle">
            The <strong>Frontend Forensic</strong> tool. Upload your code and a video 
            of the bug — our AI watches, analyzes, and pinpoints the exact cause.
        </p>
        <div class="tags">
            <span class="tag">Video Analysis</span>
            <span class="tag">Code Parsing</span>
            <span class="tag">AI Reasoning</span>
            <span class="tag">Instant Fixes</span>
        </div>
    </div>
    """, unsafe_allow_html=True)


def render_history_hero(entry: dict, timestamp_str: str):
    """
    Render the hero section for viewing historical analysis.
    
    Args:
        entry: History entry dictionary containing id and zip_name
        timestamp_str: Formatted timestamp string for display
    """
    st.markdown(f"""
    <div class="hero">
        <span class="hero-badge">Historical Report</span>
        <h1 class="hero-title" style="font-size: 2rem;">Analysis #{entry['id']}</h1>
        <p class="hero-subtitle">
            <strong>{entry['zip_name']}</strong> &middot; {timestamp_str}
        </p>
    </div>
    """, unsafe_allow_html=True)

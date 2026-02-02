"""
Config Panel Component
Renders the right-side configuration panel with API status, file settings, and stats.
"""
import streamlit as st
from typing import List
from config import API_CONFIGURED, ALL_EXTENSIONS, DEFAULT_EXTENSIONS
from utils import get_file_stats


def render_config_panel() -> List[str]:
    """
    Render the configuration panel.
    
    Returns:
        List of selected file extensions
    """
    
    # Panel Header
    st.markdown("""
    <div class="config-panel">
        <div class="config-title">Configuration</div>
    </div>
    """, unsafe_allow_html=True)
    
    # API Status
    if not API_CONFIGURED:
        st.markdown("""
        <div class="status-err">
            <span>API Not Configured</span>
        </div>
        """, unsafe_allow_html=True)
        st.caption("Add your API key to the `.env` file")
    
    st.markdown("---")
    
    # File Extensions
    st.markdown("**File Types**")
    st.caption("Select which file types to analyze")
    
    # Get current extensions from session state or use defaults
    current_extensions = st.session_state.get('allowed_extensions', DEFAULT_EXTENSIONS)
    
    selected_extensions = st.multiselect(
        "File extensions",
        options=ALL_EXTENSIONS,
        default=current_extensions,
        label_visibility="collapsed"
    )
    
    # Update session state
    st.session_state['allowed_extensions'] = selected_extensions
    
    st.markdown("---")
    
    # Session Stats
    st.markdown("**Session Stats**")
    
    processed, skipped = get_file_stats()
    
    col_a, col_b = st.columns(2)
    with col_a:
        st.metric("Analyzed", processed)
    with col_b:
        st.metric("Skipped", skipped)
    
    st.markdown("---")
    
    # Pro Tip
    st.info("**Pro Tip:** Record bug reproduction steps clearly in your video for the best AI diagnosis.")
    
    return selected_extensions


def render_footer():
    """Render the page footer."""
    st.markdown("""
    <div class="footer">
        Built for <strong>Hackathon Excellence</strong><br>
        Powered by Streamlit & Google Gemini AI
    </div>
    """, unsafe_allow_html=True)

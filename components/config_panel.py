"""
Config Panel Component
Renders the configuration panel with CWM-style design.
"""
import streamlit as st
from typing import List
from config.settings import DEFAULT_EXTENSIONS


def render_config_panel() -> List[str]:
    """Render the configuration panel with file extension selector."""
    
    st.markdown("**`[04]` / SCAN CONFIGURATION**")
    
    # File extensions selector
    selected_extensions = st.multiselect(
        "Target Extensions",
        options=DEFAULT_EXTENSIONS,
        default=DEFAULT_EXTENSIONS[:5],
        label_visibility="collapsed"
    )
    
    st.session_state['allowed_extensions'] = selected_extensions
    
    st.caption(f"[targeting {len(selected_extensions)} file types]")
    
    return selected_extensions


def render_footer():
    """Render the CWM-style footer with navigation controls."""
    
    st.divider()
    
    # Use 4 columns: Branding | Spacer | Replay | Version
    col1, col2, col3, col4 = st.columns([3, 2.5, 1.5, 0.5])
    
    with col1:
        st.markdown("""
**CodeTrace™**  
The Debugging Manual  
Powered by Gemini 1.5
        """)
    
    with col3:
        if st.button("[ REPLAY INTRO ]", use_container_width=True):
            st.session_state['sidebar_state'] = 'collapsed'
            st.rerun()
            
    with col4:
         st.markdown("v1.0.0")

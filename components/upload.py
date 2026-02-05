"""
Upload Component
Renders the file upload section using proper Streamlit components.
"""
import streamlit as st
from typing import Tuple, Optional


def render_upload_section() -> Tuple[Optional[object], Optional[object]]:
    """Render the upload section with styled cards."""
    
    # Section header
    st.markdown("### EVIDENCE UPLOAD")
    
    col1, col2 = st.columns(2, gap="medium")
    
    with col1:
        st.markdown("**`[01]` / SOURCE CODE**")
        st.caption("Upload the project ZIP archive containing the relevant source files for analysis.")
        
        zip_file = st.file_uploader(
            "Upload Codebase",
            type=['zip'],
            label_visibility="collapsed",
            key="zip_uploader"
        )
        
        if zip_file:
            st.success(f"✓ Loaded: {zip_file.name[:30]}...")
    
    with col2:
        st.markdown("**`[02]` / VISUAL EVIDENCE**")
        st.caption("Upload the screen recording (.mp4) capturing the bug's visual behavior.")
        
        video_file = st.file_uploader(
            "Upload Evidence",
            type=['mp4', 'mov', 'avi', 'webm'],
            label_visibility="collapsed",
            key="video_uploader"
        )
        
        if video_file:
            st.success(f"✓ Loaded: {video_file.name[:30]}...")
    
    return zip_file, video_file


def render_bug_description() -> str:
    """Render the bug description input."""
    
    st.markdown("**`[03]` / CONTEXT & DESCRIPTION**")
    
    description = st.text_area(
        "Describe the bug",
        placeholder="> Describe the expected behavior vs. actual result. Include steps to reproduce if possible...",
        height=100,
        label_visibility="collapsed",
        key="bug_description"
    )
    
    return description if description else ""


def render_analyze_button() -> bool:
    """Render the main action button."""
    
    st.markdown("")  # Spacer
    
    col1, col2, col3 = st.columns([1, 2, 1])
    with col2:
        return st.button(
            "[ INITIALIZE ANALYSIS ]",
            use_container_width=True,
            type="primary"
        )


def render_result_header():
    """Render the result section header."""
    
    st.markdown("---")
    st.markdown("### ANALYSIS REPORT")
    st.caption("[STATUS: COMPLETE]")

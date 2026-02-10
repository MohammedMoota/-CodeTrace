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
        st.markdown("""
        <div class="glass-card">
            <span style="color: var(--accent); font-weight: 800;">[01]</span> / SOURCE CODE
            <p style="color: var(--text-secondary); font-size: 0.8rem; margin: 0.5rem 0 1rem 0;">
                Upload the project ZIP archive containing the relevant source files for analysis.
            </p>
        </div>
        """, unsafe_allow_html=True)
        
        zip_file = st.file_uploader(
            "Upload Codebase",
            type=['zip'],
            label_visibility="collapsed",
            key="zip_uploader"
        )
        
        if zip_file:
            st.success(f"✓ Loaded: {zip_file.name[:30]}...")
    
    with col2:
        st.markdown("""
        <div class="glass-card">
            <span style="color: var(--accent); font-weight: 800;">[02]</span> / VISUAL EVIDENCE
            <p style="color: var(--text-secondary); font-size: 0.8rem; margin: 0.5rem 0 1rem 0;">
                Upload the screen recording (.mp4) capturing the bug's visual behavior.
            </p>
        </div>
        """, unsafe_allow_html=True)
        
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
    
    st.markdown("""
    <div class="glass-card" style="margin-top: 1rem;">
        <span style="color: var(--accent); font-weight: 800;">[03]</span> / CONTEXT & DESCRIPTION
        <p style="color: var(--text-secondary); font-size: 0.8rem; margin: 0.5rem 0 1rem 0;">
            Provide any additional context or steps to reproduce the bug.
        </p>
    </div>
    """, unsafe_allow_html=True)
    
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

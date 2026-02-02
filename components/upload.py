"""
Upload Component
Renders the file upload section with codebase and video uploaders.
"""
import streamlit as st
from typing import Tuple, Optional


def render_upload_section() -> Tuple[Optional[object], Optional[object]]:
    """
    Render the upload section with codebase and video uploaders.
    
    Returns:
        Tuple of (zip_file, video_file) - the uploaded files or None
    """
    
    # Section Header
    st.markdown("""
    <h2 class="section-title">Evidence Upload</h2>
    <p class="section-subtitle">Upload your project codebase and a video recording of the bug</p>
    """, unsafe_allow_html=True)
    
    # Two column layout
    col1, col2 = st.columns(2, gap="large")
    
    with col1:
        st.markdown("""
        <div class="upload-card">
            <span class="card-icon">ZIP</span>
            <div class="card-title">Codebase</div>
            <div class="card-desc">Upload your project as a ZIP file. We'll extract and analyze the relevant code files.</div>
        </div>
        """, unsafe_allow_html=True)
        
        zip_file = st.file_uploader(
            "Upload ZIP",
            type=['zip'],
            label_visibility="collapsed",
            key="zip_uploader"
        )
        
        if zip_file:
            st.success(f"Uploaded: {zip_file.name}")
    
    with col2:
        st.markdown("""
        <div class="upload-card">
            <span class="card-icon">VID</span>
            <div class="card-title">Bug Video</div>
            <div class="card-desc">Record the bug in action. The AI will analyze the visual behavior to find the issue.</div>
        </div>
        """, unsafe_allow_html=True)
        
        video_file = st.file_uploader(
            "Upload Video",
            type=['mp4', 'mov', 'avi', 'webm', 'mkv', 'flv', 'm4v'],
            label_visibility="collapsed",
            key="video_uploader"
        )
        
        if video_file:
            st.success(f"Uploaded: {video_file.name}")
    
    return zip_file, video_file


def render_analyze_button() -> bool:
    """
    Render the analyze button.
    
    Returns:
        True if button was clicked, False otherwise
    """
    return st.button(
        "Analyze Bug",
        use_container_width=True,
        type="primary"
    )


def render_result_header():
    """Render the result section header."""
    st.markdown("""
    <div class="result-box">
        <div class="result-header">Analysis Report</div>
    </div>
    """, unsafe_allow_html=True)

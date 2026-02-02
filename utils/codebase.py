"""
Codebase Processing Utilities
Handles extraction and processing of ZIP file contents.
"""
import os
import io
import zipfile
import streamlit as st
from config import IGNORED_PATHS, IGNORED_FILES


def process_codebase(zip_file, allowed_extensions: list) -> str:
    """
    Process a ZIP file and extract code contents.
    
    Args:
        zip_file: Streamlit UploadedFile object
        allowed_extensions: List of file extensions to include (e.g., ['.py', '.js'])
        
    Returns:
        Concatenated string of all matching file contents
    """
    contents = []
    files_processed = 0
    files_skipped = 0
    
    with zipfile.ZipFile(io.BytesIO(zip_file.read()), 'r') as zf:
        for file_info in zf.infolist():
            # Skip directories
            if file_info.is_dir():
                continue
            
            file_path = file_info.filename
            file_name = os.path.basename(file_path)
            
            # Skip ignored paths
            path_parts = file_path.split('/')
            if any(ignored in path_parts for ignored in IGNORED_PATHS):
                files_skipped += 1
                continue
            
            # Skip ignored files
            if file_name in IGNORED_FILES:
                files_skipped += 1
                continue
            
            # Check extension
            _, ext = os.path.splitext(file_name)
            if ext.lower() not in allowed_extensions:
                files_skipped += 1
                continue
            
            # Try to read file content
            try:
                with zf.open(file_info) as f:
                    content = f.read().decode('utf-8')
                    
                    # Format content with file markers
                    formatted = f"""
{'=' * 60}
FILE: {file_path}
{'=' * 60}
{content}
"""
                    contents.append(formatted)
                    files_processed += 1
                    
            except (UnicodeDecodeError, IOError):
                # Skip binary or unreadable files
                files_skipped += 1
                continue
    
    # Store counts in session state for display
    st.session_state['files_processed'] = files_processed
    st.session_state['files_skipped'] = files_skipped
    
    return "\n".join(contents) if contents else ""


def get_file_stats() -> tuple:
    """
    Get the current file processing statistics.
    
    Returns:
        Tuple of (files_processed, files_skipped)
    """
    return (
        st.session_state.get('files_processed', 0),
        st.session_state.get('files_skipped', 0)
    )

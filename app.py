"""
CodeTrace - AI-Powered Frontend Bug Detective
==============================================
Version: 2.2.0

A professional debugging tool that analyzes your code and bug videos
using Google Gemini AI to pinpoint issues and suggest fixes.
"""

import streamlit as st
import google.generativeai as genai
from pathlib import Path

# Import configuration
from config import (
    API_KEY, 
    API_CONFIGURED, 
    ALLOWED_EXTENSIONS_KEY, 
    STYLES_DIR
)

# Import components
from components import (
    render_sidebar,
    render_hero,
    render_history_hero,
    render_upload_section,
    render_analyze_button,
    render_result_header,
    render_config_panel,
    render_footer
)

# Import utilities
from utils import (
    process_codebase,
    upload_video,
    delete_video,
    get_analysis_prompt,
    add_to_history,
    create_model
)

# Initialize settings
if 'allowed_extensions' not in st.session_state:
    from config import DEFAULT_EXTENSIONS
    st.session_state['allowed_extensions'] = DEFAULT_EXTENSIONS


def setup_page():
    """Configure the Streamlit page settings and styles."""
    st.set_page_config(
        page_title="CodeTrace | AI Bug Detective",
        page_icon="CT",
        layout="wide",
        initial_sidebar_state="expanded"
    )
    
    # Load CSS
    css_path = STYLES_DIR / "theme.css"
    if css_path.exists():
        with open(css_path, "r", encoding="utf-8") as f:
            st.markdown(f"<style>{f.read()}</style>", unsafe_allow_html=True)
    else:
        st.warning("Theme file not found. Styles may be missing.")


def configure_api():
    """Configure the Google Gemini API."""
    if API_CONFIGURED:
        try:
            genai.configure(api_key=API_KEY)
        except Exception:
            pass


def main():
    """Main application entry point."""
    setup_page()
    configure_api()
    
    # Render Sidebar
    render_sidebar()
    
    # View history mode
    if 'view_history' in st.session_state and st.session_state['view_history']:
        entry = st.session_state['view_history']
        from datetime import datetime
        ts = datetime.fromisoformat(entry['timestamp'])
        timestamp_str = ts.strftime("%B %d, %Y at %H:%M")
        
        if st.button("← Back to Dashboard", type="secondary"):
            del st.session_state['view_history']
            st.rerun()
        
        render_history_hero(entry, timestamp_str)
        
        render_result_header()
        st.markdown(entry['full_result'])
        return
        
    # Main Dashboard Layout
    # Use columns to position the right config panel
    main_col, config_col = st.columns([3, 1], gap="large")
    
    with main_col:
        # Hero Section
        render_hero()
        
        # Upload Section
        zip_file, video_file = render_upload_section()
        
        st.markdown("")
        
        # Analyze Button and Logic
        if render_analyze_button():
            if not API_CONFIGURED:
                st.error("API key not configured. Add your Google API key to the `.env` file.")
            elif not zip_file:
                st.warning("Please upload a ZIP file containing your project code.")
            elif not video_file:
                st.warning("Please upload a video recording of the bug.")
            else:
                run_analysis(zip_file, video_file)
        
        # Footer
        render_footer()
    
    # Right Configuration Panel
    with config_col:
        render_config_panel()


def run_analysis(zip_file, video_file):
    """
    Execute the bug analysis workflow.
    
    Args:
        zip_file: The uploaded codebase ZIP
        video_file: The uploaded bug video
    """
    with st.status("Analyzing your bug...", expanded=True) as status:
        # Step 1: Process codebase
        status.write("Extracting and processing codebase...")
        try:
            code = process_codebase(zip_file, st.session_state['allowed_extensions'])
            if not code:
                st.error("No matching files found in the ZIP. Make sure it contains supported file types.")
                st.stop()
            status.write(f"✓ Processed {st.session_state.get('files_processed', 0)} files ({st.session_state.get('files_skipped', 0)} skipped)")
        except Exception as e:
            st.error(f"Error processing codebase: {str(e)}")
            st.stop()
        
        # Step 2: Upload video
        status.write("Uploading video to AI service...")
        vid_file = None
        try:
            vid_file = upload_video(video_file)
            status.write("✓ Video uploaded and ready for analysis")
        except Exception as e:
            st.error(f"Error uploading video: {str(e)}")
            st.stop()
        
        # Step 3: AI Analysis
        status.write("AI is analyzing the video and code...")
        try:
            model = create_model()
            prompt = get_analysis_prompt(code)
            response = model.generate_content([vid_file, prompt], stream=True)
            status.update(label="Analysis Complete!", state="complete", expanded=False)
        except Exception as e:
            st.error(f"AI analysis error: {str(e)}")
            if vid_file:
                delete_video(vid_file)
            st.stop()
    
    # Display results
    render_result_header()
    
    result_text = ""
    result_container = st.empty()
    
    for chunk in response:
        if chunk.text:
            result_text += chunk.text
            result_container.markdown(result_text)
    
    # Save to history
    add_to_history(
        zip_file.name, 
        video_file.name, 
        st.session_state.get('files_processed', 0), 
        result_text
    )
    st.success("Analysis saved to history!")
    
    # Cleanup
    if vid_file:
        delete_video(vid_file)


if __name__ == "__main__":
    main()

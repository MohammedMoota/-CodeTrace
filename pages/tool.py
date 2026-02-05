"""
CodeTrace Tool Page
The main debugging tool with 3D globe hero and upload functionality.
"""
import streamlit as st
import google.generativeai as genai
from pathlib import Path
import sys

# Add parent directory to path for imports
sys.path.insert(0, str(Path(__file__).parent.parent))

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
    render_bug_description,
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


def load_css():
    """Load custom CSS styling."""
    css_file = Path(STYLES_DIR) / "theme.css"
    if css_file.exists():
        try:
            css_content = css_file.read_text(encoding='utf-8')
            st.markdown(f"<style>{css_content}</style>", unsafe_allow_html=True)
        except UnicodeDecodeError:
            # Fallback - try with errors ignored
            css_content = css_file.read_text(encoding='utf-8', errors='ignore')
            st.markdown(f"<style>{css_content}</style>", unsafe_allow_html=True)


def run_analysis(zip_file, video_file, bug_description: str = ""):
    """
    Execute the analysis pipeline.
    
    Args:
        zip_file: Uploaded ZIP file containing codebase
        video_file: Uploaded video file demonstrating the bug
        bug_description: Optional text description of the bug
    """
    if not API_CONFIGURED:
        st.error("API not configured. Please set your GOOGLE_API_KEY in the .env file.")
        return
    
    try:
        genai.configure(api_key=API_KEY)
    except Exception as e:
        st.error(f"Failed to configure API: {e}")
        return
    
    progress_bar = st.progress(0)
    status_text = st.empty()
    
    # Step 1: Process codebase
    status_text.markdown("<span style='font-family: JetBrains Mono, monospace; font-size: 0.75rem; text-transform: uppercase; color: #ffd900;'>[PARSING] Extracting codebase...</span>", unsafe_allow_html=True)
    progress_bar.progress(20)
    
    code = process_codebase(
        zip_file, 
        st.session_state.get('allowed_extensions', [])
    )
    if not code:
        st.error("Failed to process the codebase. Check your ZIP file.")
        return
    
    # Step 2: Upload video
    status_text.markdown("<span style='font-family: JetBrains Mono, monospace; font-size: 0.75rem; text-transform: uppercase; color: #ffd900;'>[UPLOADING] Sending video to Gemini...</span>", unsafe_allow_html=True)
    progress_bar.progress(40)
    
    vid_file = upload_video(video_file)
    if not vid_file:
        st.error("Failed to upload video.")
        return
    
    # Step 3: Run analysis
    status_text.markdown("<span style='font-family: JetBrains Mono, monospace; font-size: 0.75rem; text-transform: uppercase; color: #ffd900;'>[ANALYZING] AI processing in progress...</span>", unsafe_allow_html=True)
    progress_bar.progress(60)
    
    try:
        model = create_model()
        prompt = get_analysis_prompt(code, bug_description)
        response = model.generate_content([vid_file, prompt], stream=True)
    except Exception as e:
        st.error(f"Analysis failed: {e}")
        delete_video(vid_file)
        return
    
    # Step 4: Stream results
    progress_bar.progress(80)
    status_text.markdown("<span style='font-family: JetBrains Mono, monospace; font-size: 0.75rem; text-transform: uppercase; color: #ffd900;'>[GENERATING] Building report...</span>", unsafe_allow_html=True)
    
    result_container = st.container()
    with result_container:
        render_result_header()
        report_placeholder = st.empty()
        
        report_text = ""
        for chunk in response:
            if hasattr(chunk, 'text'):
                report_text += chunk.text
                report_placeholder.markdown(report_text)
    
    # Save to history
    files_count = st.session_state.get('files_processed', 0)
    add_to_history(zip_file.name, video_file.name, files_count, report_text)
    
    # Cleanup
    progress_bar.progress(100)
    status_text.markdown("<span style='font-family: JetBrains Mono, monospace; font-size: 0.75rem; text-transform: uppercase; color: #ffd900;'>[COMPLETE] Analysis finished successfully.</span>", unsafe_allow_html=True)
    delete_video(vid_file)


def show_history_entry(entry: dict):
    """Display a historical analysis entry."""
    from datetime import datetime
    
    timestamp = datetime.fromisoformat(entry['timestamp'])
    timestamp_str = timestamp.strftime("%B %d, %Y at %I:%M %p")
    
    render_history_hero(entry, timestamp_str)
    
    st.markdown(f"""
    <div class="result-box">
        <div class="result-header">Analysis Report</div>
    </div>
    """, unsafe_allow_html=True)
    
    st.markdown(entry['full_result'])
    
    if st.button("Back to Tool", type="secondary"):
        del st.session_state['viewing_history']
        st.rerun()


def main():
    """Main application entry point."""
    
    # Dynamic sidebar state
    if 'sidebar_state' not in st.session_state:
        st.session_state['sidebar_state'] = 'collapsed'
        
    st.set_page_config(
        page_title="CodeTrace Tool",
        page_icon="◉",
        layout="wide",
        initial_sidebar_state=st.session_state['sidebar_state']
    )
    
    load_css()
    
    # Render sidebar (returns selected history entry if any)
    history_entry = render_sidebar()
    
    # Check if viewing history (must be not None, not just present)
    if st.session_state.get('viewing_history') is not None:
        show_history_entry(st.session_state['viewing_history'])
        render_footer()
        return
    
    if history_entry:
        st.session_state['viewing_history'] = history_entry
        st.rerun()
    
    # Main content
    is_sidebar_open = st.session_state.get('sidebar_state') == 'expanded'
    render_hero(skip_animation=is_sidebar_open)
    
    # Upload Section (Code + Video)
    zip_file, video_file = render_upload_section()
    
    # Bug description
    bug_description = render_bug_description()
    
    # Analyze button
    if render_analyze_button():
        if zip_file and video_file:
            run_analysis(zip_file, video_file, bug_description)
        else:
            st.warning("Please upload both a ZIP file and a video file.")
    
    render_footer()


if __name__ == "__main__":
    main()

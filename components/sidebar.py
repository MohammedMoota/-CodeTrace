"""
Sidebar Component
Renders the left sidebar with branding, history, and quick guide.
"""
import streamlit as st
from datetime import datetime
from utils import load_history, clear_history


def render_sidebar():
    """Render the left sidebar with logo, analysis history, and quick guide."""
    
    with st.sidebar:
        # Logo Header
        st.markdown("""
        <div class="sidebar-header">
            <div class="sidebar-logo">CT</div>
            <div class="sidebar-title">CodeTrace</div>
            <div class="sidebar-subtitle">AI Bug Detective</div>
        </div>
        """, unsafe_allow_html=True)
        
        st.markdown("---")
        
        # History Section
        st.markdown("#### Analysis History")
        
        history = load_history()
        
        if history:
            for i, entry in enumerate(history[:10]):
                timestamp = datetime.fromisoformat(entry['timestamp'])
                time_str = timestamp.strftime('%b %d, %H:%M')
                
                with st.expander(
                    f"#{entry['id']} - {entry['zip_name'][:18]}...",
                    expanded=False
                ):
                    st.caption(f"Time: {time_str}")
                    st.caption(f"Files: {entry['files_analyzed']} analyzed")
                    st.caption(f"Video: {entry.get('video_name', 'Unknown')[:20]}...")
                    
                    if st.button("View Full Report", key=f"view_{i}", use_container_width=True):
                        st.session_state['view_history'] = entry
                        st.rerun()
            
            st.markdown("")
            
            if st.button("Clear All History", use_container_width=True):
                clear_history()
                st.toast("History cleared!")
                st.rerun()
        else:
            st.info("No analyses yet. Upload code and a video to get started!")
        
        st.markdown("---")
        
        # Quick Guide
        st.markdown("#### Quick Guide")
        st.markdown("""
        <div style="color: rgba(237, 238, 201, 0.6); font-size: 0.85rem; line-height: 1.8;">
            <strong>1.</strong> Upload your codebase (ZIP)<br>
            <strong>2.</strong> Upload bug recording (video)<br>
            <strong>3.</strong> Click <strong>Analyze Bug</strong><br>
            <strong>4.</strong> Get AI-powered fix suggestions
        </div>
        """, unsafe_allow_html=True)

"""
Sidebar Component
Renders the left sidebar with CWM-style navigation and history.
"""
import streamlit as st
import streamlit.components.v1 as components
from datetime import datetime
from utils import load_history, clear_history


def render_sidebar():
    """Render the CWM-style sidebar with navigation and history."""
    
    with st.sidebar:
        # Header with Logo
        st.markdown("""
        <div style="padding: 1rem 0;">
            <h1 style="font-size: 1.5rem !important; margin: 0; background: linear-gradient(to right, #fff, var(--accent)); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">CodeTrace</h1>
            <span style="font-size: 0.6rem; letter-spacing: 0.2em; color: var(--text-secondary); text-transform: uppercase;">Elite Bug Detective</span>
        </div>
        """, unsafe_allow_html=True)
        
        st.divider()
        
        # Close button - uses JavaScript to collapse sidebar
        if st.button("[ ✕ CLOSE ]", key="close_sidebar_btn", use_container_width=True):
            # Update session state
            st.session_state['sidebar_state'] = 'collapsed'
            
            # Inject JavaScript to physically close the sidebar
            import time
            ts = time.time()
            components.html(f"""
            <script>
                // Timestamp: {ts}
                (function() {{
                    const sidebar = window.parent.document.querySelector('[data-testid="stSidebar"]');
                    if (sidebar) {{
                        // Use Streamlit's internal mechanism - simulate ESC key or click outside
                        sidebar.style.transform = 'translateX(-100%)';
                        sidebar.style.visibility = 'hidden';
                        
                        // Also trigger a click on the toggle button to sync state
                        const toggle = window.parent.document.querySelector('[data-testid="stSidebarCollapsedControl"]');
                        if (toggle) {{
                            setTimeout(() => {{ toggle.click(); }}, 100);
                        }}
                    }}
                }})();
            </script>
            """, height=0, width=0)
        
        st.divider()
        
        # History Section
        st.markdown("**/ RECENT ANALYSIS**")
        
        history = load_history()
        
        if history:
            for i, entry in enumerate(history[:6]):
                timestamp = datetime.fromisoformat(entry['timestamp'])
                name = entry['zip_name'][:18] + "..." if len(entry['zip_name']) > 18 else entry['zip_name']
                
                if st.button(
                    f"{i+1:02d}  {name}",
                    key=f"hist_{i}",
                    use_container_width=True
                ):
                    st.session_state['viewing_history'] = entry
                    st.rerun()
            
            st.markdown("")  # Spacer
            
            if st.button("[ CLR HISTORY ]", use_container_width=True, type="secondary"):
                clear_history()
                st.rerun()
        else:
            st.caption("// No logs found")
        
        st.divider()
        
        # Quick Guide
        st.markdown("**/ MANUAL**")
        st.markdown("""
        <div style="font-family: var(--font-mono); font-size: 0.8rem; color: var(--text-secondary);">
            <div style="margin-bottom: 0.5rem;"><span style="color: var(--accent);">[01]</span> UPLOAD CODEBASE</div>
            <div style="margin-bottom: 0.5rem;"><span style="color: var(--accent);">[02]</span> UPLOAD EVIDENCE</div>
            <div style="margin-bottom: 0.5rem;"><span style="color: var(--accent);">[03]</span> ADD CONTEXT</div>
            <div><span style="color: var(--accent);">[04]</span> INITIALIZE SCAN</div>
        </div>
        """, unsafe_allow_html=True)
        
        # Footer
        st.markdown("---")
        st.caption("v1.0.0 | CodeTrace™")

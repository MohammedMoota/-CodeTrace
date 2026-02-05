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
        # Custom Close Button - Uses JS to force close + Timestamp to ensure execution
        if st.button("[ CLOSE PANEL ]", key="close_sidebar_btn", use_container_width=True):
            st.session_state['sidebar_state'] = 'collapsed'
            
            # Inject JS to force click the native close button (which is hidden but exists)
            import time
            ts = time.time()
            components.html(f"""
            <script>
                // Timestamp: {ts}
                try {{
                    const btn = window.parent.document.querySelector('[data-testid="stSidebar"] [data-testid="stSidebarHeader"] button');
                    if (btn) {{
                        btn.click();
                    }} else {{
                        // Fallback mechanism
                        const header = window.parent.document.querySelector('[data-testid="stSidebarHeader"]');
                        if (header) {{
                            const innerBtn = header.querySelector('button');
                            if (innerBtn) innerBtn.click();
                        }}
                    }}
                }} catch(e) {{ console.log(e); }}
            </script>
            """, height=0, width=0)
            
            st.rerun()
            
        st.markdown("") # Spacer
        
        # Logo & Title using st.markdown with proper escaping
        st.markdown("# Code**Trace**")
        
        st.divider()
        
        st.divider()
        
        # History Section
        st.markdown("**/ RECENT ANALYSIS**")
        
        history = load_history()
        
        if history:
            for i, entry in enumerate(history[:6]):
                timestamp = datetime.fromisoformat(entry['timestamp'])
                time_str = timestamp.strftime('%m.%d / %H:%M')
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
`[01]` Upload codebase  
`[02]` Upload evidence  
`[03]` Add context  
`[04]` Initialize scan
        """)
        
        # Footer
        st.markdown("---")
        st.caption("v1.0.0 | CodeTrace™")

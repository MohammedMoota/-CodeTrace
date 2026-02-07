"""
Hero Component
Renders the advanced 3-phase scroll-locked hero using the assets in components/hero/assets/.
"""
import streamlit as st
import streamlit.components.v1 as components
import os
import textwrap

def render_hero(skip_animation=False):
    """Reads the HTML/CSS/JS assets and renders the full-screen hero."""
    
    # Define paths
    base_path = os.path.dirname(os.path.abspath(__file__))
    assets_path = os.path.join(base_path, 'hero', 'assets')
    
    try:
        # Inject CSS - toggle hidden by default, visible when scrolled to footer
        st.markdown("""
            <style>
                /* Hide Streamlit header decorations */
                [data-testid="stHeader"] {
                    background-color: transparent !important;
                }
                [data-testid="stDecoration"] {
                    display: none !important;
                }
                
                /* Hide sidebar header (close button that Streamlit provides) */
                [data-testid="stSidebarHeader"] {
                    display: none !important;
                }
                
                /* Hide Streamlit navigation */
                [data-testid="stSidebarNav"] {
                    display: none !important;
                }
                
                /* TOP-LEFT TOGGLE - Hidden by default */
                [data-testid="stSidebarCollapsedControl"] {
                    opacity: 0 !important;
                    pointer-events: none !important;
                    transition: opacity 0.3s ease !important;
                    z-index: 999999 !important;
                }
                
                /* Make toggle white */
                [data-testid="stSidebarCollapsedControl"] svg {
                    fill: #ffffff !important;
                    stroke: #ffffff !important;
                }
                
                /* VISIBLE when scrolled to footer - class added by JS */
                [data-testid="stSidebarCollapsedControl"].show-toggle {
                    opacity: 1 !important;
                    pointer-events: auto !important;
                }
                
                /* Remove Streamlit padding for fullscreen hero */
                .stApp, .main, .block-container,
                [data-testid="stAppViewContainer"],
                [data-testid="stAppViewContainer"] > .main,
                [data-testid="stAppViewContainer"] > .main .block-container {
                    padding: 0 !important;
                    margin: 0 !important;
                }
            </style>
        """, unsafe_allow_html=True)
        
        # Inject scroll detection JavaScript
        scroll_js = """
        <script>
            (function() {
                function initScrollWatcher() {
                    const parentDoc = window.parent.document;
                    const toggle = parentDoc.querySelector('[data-testid="stSidebarCollapsedControl"]');
                    const scrollContainer = parentDoc.querySelector('[data-testid="stAppViewContainer"]');
                    
                    if (!toggle || !scrollContainer) {
                        // Retry if elements not found yet
                        setTimeout(initScrollWatcher, 500);
                        return;
                    }
                    
                    function checkScroll() {
                        const { scrollTop, scrollHeight, clientHeight } = scrollContainer;
                        const distanceFromBottom = scrollHeight - scrollTop - clientHeight;
                        
                        // Show toggle when within 400px of bottom (footer area)
                        if (distanceFromBottom < 400) {
                            toggle.classList.add('show-toggle');
                        } else {
                            toggle.classList.remove('show-toggle');
                        }
                    }
                    
                    // Remove old listeners and attach new one
                    scrollContainer.removeEventListener('scroll', checkScroll);
                    scrollContainer.addEventListener('scroll', checkScroll, { passive: true });
                    
                    // Initial check
                    checkScroll();
                }
                
                // Start watching after a short delay
                setTimeout(initScrollWatcher, 800);
            })();
        </script>
        """
        components.html(scroll_js, height=0, width=0)

        if skip_animation:
            return

        with open(os.path.join(assets_path, 'index.html'), 'r') as f:
            html_template = f.read()
        
        with open(os.path.join(assets_path, 'style.css'), 'r') as f:
            css_content = f.read()
            
        with open(os.path.join(assets_path, 'script.js'), 'r') as f:
            js_content = f.read()
            
        # Assemble valid HTML blob - include FULLSCREEN CSS inside the component
        import time
        ts = int(time.time())
        
        # The trick: Put a fullscreen overlay div INSIDE the iframe that covers the parent window
        final_html = f"""
        <!-- FORCE RELOAD V32: {ts} -->
        <!DOCTYPE html>
        <html>
        <head>
            <style>
            {css_content}
            </style>
        </head>
        <body>
        {html_template}
        <script>
        {js_content}
        
        // Make the PARENT iframe fullscreen
        (function() {{
            try {{
                // Access parent styles and make our iframe fullscreen
                var iframe = window.frameElement;
                if (iframe) {{
                    iframe.style.cssText = 'position: fixed !important; top: 0 !important; left: 0 !important; width: 100vw !important; height: 100vh !important; z-index: 99999 !important; border: none !important;';
                }}
            }} catch(e) {{
                console.log('Could not access parent frame');
            }}
        }})();
        </script>
        </body>
        </html>
        """
        
        # Render the component with minimal height (the JS will resize it)
        components.html(final_html, height=100, scrolling=False)
        
    except Exception as e:
        st.error(f"Error loading hero assets: {e}")

def render_history_hero(entry: dict, timestamp_str: str):
    """Render the history header."""
    html_content = textwrap.dedent(f"""
        <style>
            .history-header {{
                background: #f5f5f5;
                padding: 2rem;
                margin: -1rem -1rem 2rem -1rem;
            }}
            .history-badge {{
                font-family: 'JetBrains Mono', monospace;
                font-size: 0.65rem;
                text-transform: uppercase;
                color: #080807;
                border: 1px solid #080807;
                padding: 0.25rem 0.5rem;
                display: inline-block;
            }}
            .history-title {{
                font-family: 'Inter', sans-serif;
                font-size: 3rem;
                font-weight: 800;
                text-transform: uppercase;
                color: #080807;
                margin: 1rem 0;
            }}
            .history-meta {{
                font-family: 'JetBrains Mono', monospace;
                font-size: 0.7rem;
                text-transform: uppercase;
                color: #666;
            }}
        </style>
        
        <div class="history-header">
            <span class="history-badge">Report #{entry['id']}</span>
            <span class="history-meta" style="float: right;">{timestamp_str}</span>
            <h1 class="history-title">Analysis Log</h1>
            <div class="history-meta">
                Target: {entry['zip_name'][:30]}... | Files analyzed: {entry['files_analyzed']}
            </div>
        </div>
    """).strip()
    st.markdown(html_content, unsafe_allow_html=True)

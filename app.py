"""
CodeTrace - Main Entry Point
Redirects to the Tool page
"""
import streamlit as st

# Page config
st.set_page_config(
    page_title="CodeTrace",
    page_icon="◉",
    layout="wide",
    initial_sidebar_state="collapsed"
)

# Hide the main page from sidebar
st.markdown("""
<style>
[data-testid="stSidebarNav"] {
    display: none;
}
</style>
""", unsafe_allow_html=True)

# Auto-redirect to tool page
st.switch_page("pages/tool.py")

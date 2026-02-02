"""
CodeTrace Configuration Settings
"""
import os
from pathlib import Path
from dotenv import load_dotenv
import google.generativeai as genai

# Load environment variables
load_dotenv()

# ============================================================================
# API Configuration
# ============================================================================

API_KEY = os.getenv("GOOGLE_API_KEY")
API_CONFIGURED = False

if API_KEY and API_KEY != "your_api_key_here":
    try:
        genai.configure(api_key=API_KEY)
        API_CONFIGURED = True
    except Exception:
        API_CONFIGURED = False

# ============================================================================
# Paths
# ============================================================================

PROJECT_ROOT = Path(__file__).parent.parent
HISTORY_FILE = PROJECT_ROOT / "analysis_history.json"
STYLES_DIR = PROJECT_ROOT / "styles"

# ============================================================================
# File Processing Settings
# ============================================================================

IGNORED_PATHS = {
    '__MACOSX', '.git', 'node_modules', '__pycache__',
    '.vscode', '.idea', 'dist', 'build', '.next', '.nuxt',
    'coverage', '.cache', 'venv', 'env'
}

IGNORED_FILES = {
    'package-lock.json', 'yarn.lock', 'pnpm-lock.yaml',
    '.DS_Store', 'Thumbs.db', '.gitignore', '.npmrc',
    '.env', '.env.local', '.env.production'
}

DEFAULT_EXTENSIONS = ['.py', '.js', '.tsx', '.css']

ALL_EXTENSIONS = [
    '.py', '.js', '.jsx', '.ts', '.tsx',
    '.css', '.scss', '.html', '.vue', '.svelte',
    '.json', '.md'
]

# ============================================================================
# AI Settings
# ============================================================================

ALLOWED_EXTENSIONS_KEY = 'allowed_extensions'

AI_MODEL = "gemini-1.5-flash-latest"

SYSTEM_PROMPT = """You are an Elite Frontend Debugger specializing in visual bug analysis.

Your task is to:
1. Analyze the video to identify the exact moment and nature of the bug
2. Correlate the visual symptoms with the provided codebase
3. Pinpoint the root cause with specific file and line references
4. Provide corrected code with clear explanations"""

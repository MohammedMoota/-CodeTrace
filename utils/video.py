"""
Video Processing Utilities
Handles video upload and AI analysis via Google Gemini.
"""
import os
import time
import tempfile
import google.generativeai as genai
from config import AI_MODEL, SYSTEM_PROMPT


def upload_video(video_file) -> object:
    """
    Upload a video file to Google Gemini.
    
    Args:
        video_file: Streamlit UploadedFile object
        
    Returns:
        Gemini File object in ACTIVE state
        
    Raises:
        Exception: If video processing fails
    """
    # Save to temporary file
    with tempfile.NamedTemporaryFile(delete=False, suffix='.mp4') as tmp:
        tmp.write(video_file.read())
        tmp_path = tmp.name
    
    try:
        # Upload to Gemini
        file = genai.upload_file(path=tmp_path, display_name=video_file.name)
        
        # Wait for processing to complete
        while file.state.name == "PROCESSING":
            time.sleep(2)
            file = genai.get_file(file.name)
        
        if file.state.name == "ACTIVE":
            return file
        else:
            raise Exception(f"Video processing failed: {file.state.name}")
            
    finally:
        # Clean up temporary file
        if os.path.exists(tmp_path):
            os.remove(tmp_path)


def delete_video(video_file) -> bool:
    """
    Delete a video file from Gemini storage.
    
    Args:
        video_file: Gemini File object
        
    Returns:
        True if deletion successful, False otherwise
    """
    try:
        genai.delete_file(video_file.name)
        return True
    except Exception:
        return False


def get_analysis_prompt(codebase: str, bug_description: str = "") -> str:
    """
    Generate the analysis prompt for the AI.
    
    Args:
        codebase: The extracted codebase content
        bug_description: Optional user-provided description of the bug
        
    Returns:
        Formatted prompt string
    """
    # Build the user context section if description is provided
    user_context = ""
    if bug_description.strip():
        user_context = f"""
## USER BUG DESCRIPTION

The developer provided the following context about the bug:

> {bug_description}

Use this information to focus your analysis on the specific issue described.

---
"""
    
    return f"""Analyze the video and codebase to find and fix the bug.

## ANALYSIS PROTOCOL

### 1. Video Analysis
- Identify the exact moment the bug occurs in the video
- Describe the visual symptoms in detail
- Note any user interactions that trigger the bug

### 2. Code Correlation
- Scan the codebase for components related to the buggy behavior
- Identify files and functions that could cause the issue
- Trace the code execution path

### 3. Root Cause
- Pinpoint the specific file(s) and line(s) causing the bug
- Explain WHY this code produces the visual bug

### 4. Solution
- Provide corrected code blocks
- Explain the fix clearly

---
{user_context}
## CODEBASE

{codebase}

---

Provide your detailed debugging report below:
"""


def create_model():
    """
    Create a configured Gemini model instance.
    
    Returns:
        GenerativeModel instance
    """
    return genai.GenerativeModel(
        model_name=AI_MODEL,
        system_instruction=SYSTEM_PROMPT
    )

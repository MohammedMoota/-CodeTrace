"""
History Management Utilities
Handles saving and loading analysis history from JSON file.
"""
import json
from datetime import datetime
from config import HISTORY_FILE


def load_history() -> list:
    """Load analysis history from JSON file."""
    if HISTORY_FILE.exists():
        try:
            with open(HISTORY_FILE, 'r', encoding='utf-8') as f:
                return json.load(f)
        except (json.JSONDecodeError, IOError):
            return []
    return []


def save_history(history: list) -> None:
    """Save analysis history to JSON file."""
    with open(HISTORY_FILE, 'w', encoding='utf-8') as f:
        json.dump(history, f, indent=2, ensure_ascii=False)


def add_to_history(
    zip_name: str,
    video_name: str,
    files_count: int,
    result: str
) -> dict:
    """
    Add a new analysis entry to history.
    
    Args:
        zip_name: Name of the uploaded ZIP file
        video_name: Name of the uploaded video file
        files_count: Number of files analyzed
        result: The AI analysis result text
        
    Returns:
        The created history entry
    """
    history = load_history()
    
    entry = {
        "id": len(history) + 1,
        "timestamp": datetime.now().isoformat(),
        "zip_name": zip_name,
        "video_name": video_name,
        "files_analyzed": files_count,
        "full_result": result
    }
    
    history.insert(0, entry)
    save_history(history[:50])  # Keep only last 50 entries
    
    return entry


def clear_history() -> None:
    """Delete all history data."""
    if HISTORY_FILE.exists():
        HISTORY_FILE.unlink()


def get_history_count() -> int:
    """Get the total number of history entries."""
    return len(load_history())

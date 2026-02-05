# CodeTrace - AI Bug Detective

An AI-powered visual debugging tool that analyzes code and video recordings to identify and fix bugs.

## Features

- **Video Analysis**: Upload a screen recording of the bug in action
- **Code Analysis**: Upload your codebase as a ZIP file
- **AI-Powered**: Uses Google Gemini AI to correlate visual bugs with code
- **Detailed Reports**: Get specific file and line references with fix suggestions
- **History**: View past analyses anytime

## Project Structure

```
TraceBack Project/
├── app.py                    # Entry point (redirects to tool page)
├── pages/
│   └── tool.py               # Main tool page with all functionality
├── components/
│   ├── __init__.py           # Component exports
│   ├── hero.py               # 3D rotating sphere hero section
│   ├── sidebar.py            # Sidebar with history and guide
│   ├── upload.py             # File upload components
│   └── config_panel.py       # Configuration panel and footer
├── utils/
│   ├── __init__.py           # Utility exports
│   ├── codebase.py           # ZIP extraction and processing
│   ├── video.py              # Video upload and AI analysis
│   └── history.py            # Analysis history management
├── config/
│   ├── __init__.py           # Config exports
│   └── settings.py           # All configuration settings
├── styles/
│   └── theme.css             # Custom CSS styling
├── .env                      # API key (GOOGLE_API_KEY)
└── README.md                 # This file
```

## Setup

1. **Install dependencies**:
   ```bash
   pip install streamlit google-generativeai python-dotenv
   ```

2. **Configure API Key**:
   Create a `.env` file with:
   ```
   GOOGLE_API_KEY=your_api_key_here
   ```

3. **Run the app**:
   ```bash
   streamlit run app.py
   ```

4. **Access**: Open `http://localhost:8501/tool`

## Usage

1. Upload your project codebase as a ZIP file
2. Upload a video recording of the bug
3. (Optional) Describe the bug in the text area
4. Click "Analyze Bug"
5. Review the AI-generated debugging report

## Tech Stack

- **Frontend**: Streamlit
- **AI**: Google Gemini 1.5 Flash
- **3D Hero**: CSS 3D transforms with JavaScript physics

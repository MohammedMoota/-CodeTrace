<<<<<<< HEAD
# CodeTrace: AI-Powered Frontend Bug Detective

CodeTrace is a professional debugging tool that analyzes project codebases and bug reproduction videos to pinpoint visual bugs and suggest fixes. Powered by Google Gemini AI, it helps frontend developers reduce debugging time by correlating visual symptoms with the source code.

## Professional Features

- **Video-to-Code Correlation**: AI analyzes UI behavior in videos and identifies the relevant code sections.
- **Support for Multi-Language Projects**: Analyzes Python, JavaScript, TypeScript, CSS, and more.
- **Modular Architecture**: Clean, maintainable codebase with separated UI components and processing utilities.
- **Privacy Focused**: No data is stored externally beyond the AI analysis session.

## Quick Start

1. **Prerequisites**:
   - Python 3.11+
   - Google Gemini API Key

2. **Installation**:
   ```bash
   pip install streamlit google-generativeai python-dotenv
   ```

3. **Configuration**:
   - Create a `.env` file in the root directory.
   - Add your API key: `GOOGLE_API_KEY=your_key_here`

4. **Run Application**:
   ```bash
   streamlit run app.py
   ```

## Project Structure

- `app.py`: Main entry point and orchestration.
- `components/`: UI modules (Sidebar, Hero, Upload, Config).
- `utils/`: Core logic for codebase extraction, video processing, and history.
- `config/`: Centralized settings and constants.
- `styles/`: Custom professional CSS themes.

---
Built for performance and debugging excellence.
=======
# -CodeTrace
>>>>>>> 657f121e5cde35cba5d0be739c52b45f12accdf4

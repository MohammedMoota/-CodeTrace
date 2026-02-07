/**
 * Upload Section Component
 * 
 * File upload interface for:
 * - Source code (ZIP)
 * - Visual evidence (video)
 * - Bug description
 * 
 * TODO: Connect to FastAPI backend for actual file processing
 */

import { useState } from 'react';
import { UPLOAD } from '../constants';
import './UploadSection.css';

function UploadSection() {
    // =========================================================================
    // State
    // =========================================================================
    const [zipFile, setZipFile] = useState(null);
    const [videoFile, setVideoFile] = useState(null);
    const [description, setDescription] = useState('');
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    // =========================================================================
    // Handlers
    // =========================================================================

    /**
     * Validate and set uploaded file
     */
    const handleFileChange = (file, setter) => {
        if (!file) return;

        if (file.size > UPLOAD.MAX_FILE_SIZE) {
            alert(`File too large. Maximum size is ${UPLOAD.MAX_FILE_SIZE / 1024 / 1024}MB`);
            return;
        }

        setter(file);
    };

    /**
     * Submit files for analysis
     * TODO: Replace with actual API call
     */
    const handleAnalyze = async () => {
        if (!zipFile || !videoFile) {
            alert('Please upload both a ZIP file and a video file.');
            return;
        }

        setIsAnalyzing(true);

        try {
            // TODO: Implement API call to FastAPI backend
            // const formData = new FormData();
            // formData.append('code', zipFile);
            // formData.append('video', videoFile);
            // formData.append('description', description);
            // await fetch(`${API_BASE_URL}/analyze`, { method: 'POST', body: formData });

            // Placeholder delay
            await new Promise(resolve => setTimeout(resolve, 2000));
            alert('Analysis complete! (Backend not yet connected)');
        } catch (error) {
            console.error('Analysis failed:', error);
            alert('Analysis failed. Please try again.');
        } finally {
            setIsAnalyzing(false);
        }
    };

    // =========================================================================
    // Render
    // =========================================================================
    return (
        <section className="upload-section">
            <div className="upload-container">
                <h2 className="section-title">EVIDENCE UPLOAD</h2>

                {/* Upload Grid: Code + Video */}
                <div className="upload-grid">
                    {/* Source Code Upload */}
                    <UploadBox
                        number="01"
                        label="SOURCE CODE"
                        description="Upload the project ZIP archive containing the relevant source files for analysis."
                        accept=".zip"
                        file={zipFile}
                        onChange={(e) => handleFileChange(e.target.files[0], setZipFile)}
                        hint="Limit 200MB • ZIP"
                        icon="📁"
                    />

                    {/* Video Evidence Upload */}
                    <UploadBox
                        number="02"
                        label="VISUAL EVIDENCE"
                        description="Upload the screen recording (.MP4) capturing the bug's visual behavior."
                        accept=".mp4,.mov,.avi,.webm,.mpeg4"
                        file={videoFile}
                        onChange={(e) => handleFileChange(e.target.files[0], setVideoFile)}
                        hint="Limit 200MB • MP4, MOV, AVI, WEBM"
                        icon="🎬"
                    />
                </div>

                {/* Bug Description */}
                <div className="description-box">
                    <div className="upload-header">
                        <span className="upload-badge">[03]</span>
                        <span className="upload-label">/ CONTEXT & DESCRIPTION</span>
                    </div>
                    <textarea
                        className="description-input"
                        placeholder="› Describe the expected behavior vs. actual result. Include steps to reproduce if possible..."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={4}
                    />
                </div>

                {/* Submit Button */}
                <button
                    className={`analyze-button ${isAnalyzing ? 'loading' : ''}`}
                    onClick={handleAnalyze}
                    disabled={isAnalyzing}
                >
                    {isAnalyzing ? '[ ANALYZING... ]' : '[ INITIALIZE ANALYSIS ]'}
                </button>
            </div>
        </section>
    );
}

// =============================================================================
// Sub-component: Upload Box
// =============================================================================

/**
 * Reusable file upload dropzone
 */
function UploadBox({ number, label, description, accept, file, onChange, hint, icon }) {
    return (
        <div className="upload-box">
            <div className="upload-header">
                <span className="upload-badge">[{number}]</span>
                <span className="upload-label">/ {label}</span>
            </div>
            <p className="upload-description">{description}</p>

            <div className="upload-dropzone">
                <input
                    type="file"
                    accept={accept}
                    onChange={onChange}
                    className="dropzone-input"
                />
                <div className="dropzone-content">
                    <span className="dropzone-icon">{icon}</span>
                    <span className="dropzone-text">
                        {file ? file.name : 'Drag and drop file here'}
                    </span>
                    <span className="dropzone-hint">{hint}</span>
                </div>
                <span className="browse-button">Browse files</span>
            </div>
        </div>
    );
}

export default UploadSection;

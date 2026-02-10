"use client";

import { useState, useCallback } from "react";
import styles from "./UploadSection.module.css";
import { toast } from "sonner";

const MAX_FILE_SIZE = 1024 * 1024 * 1024; // 1GB

export default function UploadSection() {
    const [zipFile, setZipFile] = useState<File | null>(null);
    const [videoFile, setVideoFile] = useState<File | null>(null);
    const [videoPreview, setVideoPreview] = useState<string | null>(null);
    const [description, setDescription] = useState("");
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    const handleFileChange = useCallback((file: File | undefined, setter: (f: File) => void, isVideo = false) => {
        if (!file) return;
        if (file.size > MAX_FILE_SIZE) {
            toast.error(`File too large. Maximum size is 1GB`);
            return;
        }

        setter(file);

        if (isVideo && file.type.startsWith('video/')) {
            const url = URL.createObjectURL(file);
            setVideoPreview(url);
            toast.success("Video evidence uploaded");
        } else if (!isVideo) {
            toast.success(`Codebase uploaded: ${file.name}`);
        }
    }, []);

    const handleRemove = useCallback((isVideo = false) => {
        if (isVideo) {
            setVideoFile(null);
            setVideoPreview(null);
            toast.info("Video removed");
        } else {
            setZipFile(null);
            toast.info("File removed");
        }
    }, []);

    const handleAnalyze = async () => {
        if (!zipFile || !videoFile) {
            alert("Please upload both a ZIP file and a video file.");
            return;
        }
        setIsAnalyzing(true);
        try {
            await new Promise((r) => setTimeout(r, 2000));
            alert("Analysis complete! (Backend not yet connected)");
        } catch {
            alert("Analysis failed. Please try again.");
        } finally {
            setIsAnalyzing(false);
        }
    };

    return (
        <section className={styles.section}>
            <div className={styles.container}>
                <h2 className={styles.title}>Evidence Upload</h2>

                <div className={styles.grid}>
                    <UploadBox
                        number="01"
                        label="Source Code"
                        description="Upload the project ZIP archive containing the relevant source files."
                        accept=".zip"
                        file={zipFile}
                        onChange={(f) => handleFileChange(f, setZipFile, false)}
                        onRemove={() => handleRemove(false)}
                        hint="Limit 1GB • ZIP"
                        icon="📁"
                    />
                    <UploadBox
                        number="02"
                        label="Visual Evidence"
                        description="Upload the screen recording (.MP4) capturing the bug's behavior."
                        accept=".mp4,.mov,.avi,.webm"
                        file={videoFile}
                        onChange={(f) => handleFileChange(f, setVideoFile, true)}
                        onRemove={() => handleRemove(true)}
                        hint="Limit 1GB • MP4, MOV, AVI, WEBM"
                        icon="🎬"
                        previewUrl={videoPreview}
                    />
                </div>

                <div className={styles.descriptionBox}>
                    <div className={styles.header}>
                        <span className={styles.badge}>[03]</span>
                        <span className={styles.label}>/ Context & Description</span>
                    </div>
                    <textarea
                        className={styles.textarea}
                        placeholder="› Describe the expected behavior vs. actual result..."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={4}
                    />
                </div>

                <button
                    className={`${styles.analyzeBtn} ${isAnalyzing ? styles.loading : ""}`}
                    onClick={handleAnalyze}
                    disabled={isAnalyzing}
                >
                    {isAnalyzing ? "[ Analyzing... ]" : "[ Initialize Analysis ]"}
                </button>
            </div>
        </section>
    );
}

interface UploadBoxProps {
    number: string;
    label: string;
    description: string;
    accept: string;
    file: File | null;
    onChange: (file: File | undefined) => void;
    onRemove: () => void;
    hint: string;
    icon: string;
    previewUrl?: string | null;
}

function UploadBox({ number, label, description, accept, file, onChange, onRemove, hint, icon, previewUrl }: UploadBoxProps) {
    const [dragover, setDragover] = useState(false);

    return (
        <div className={styles.box}>
            <div className={styles.header}>
                <span className={styles.badge}>[{number}]</span>
                <span className={styles.label}>/ {label}</span>
            </div>
            <p className={styles.desc}>{description}</p>

            <div
                className={`${styles.dropzone} ${dragover ? styles.dragover : ""} ${file ? styles.hasFile : ""}`}
                onDragOver={(e) => { e.preventDefault(); setDragover(true); }}
                onDragLeave={() => setDragover(false)}
                onDrop={(e) => {
                    e.preventDefault();
                    setDragover(false);
                    onChange(e.dataTransfer.files[0]);
                }}
            >
                <input
                    type="file"
                    accept={accept}
                    onChange={(e) => onChange(e.target.files?.[0])}
                    className={styles.fileInput}
                />

                <div className={styles.dropzoneContent}>
                    <span className={styles.dropzoneIcon}>{icon}</span>
                    <span className={styles.dropzoneText}>
                        {file ? "Replace File" : "Drag and drop file here"}
                    </span>
                    <span className={styles.dropzoneHint}>{hint}</span>
                </div>

                <span className={styles.browseBtn}>Browse files</span>
            </div>

            {/* File Info Displayed BELOW the container */}
            {file && (
                <div className={styles.fileInfo}>
                    <div className={styles.fileRow}>
                        <div className={styles.fileName}>
                            <span className={styles.successIcon}>✓</span>
                            {file.name}
                        </div>
                        <button className={styles.removeBtn} onClick={onRemove}>[ REMOVE ]</button>
                    </div>

                    {previewUrl && (
                        <div className={styles.videoContainer}>
                            <video
                                src={previewUrl}
                                autoPlay
                                muted
                                loop
                                playsInline
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover',
                                    display: 'block'
                                }}
                            />
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

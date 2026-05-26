package com.smartstudy.smartstudy_backend.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "study_files")
public class StudyFile {

    // =========================
    // ID
    // =========================

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // =========================
    // USER
    // =========================

    private Long userId;

    // =========================
    // TITLE
    // =========================

    private String title;

    // =========================
    // SUBJECT
    // =========================

    private String subject;

    // =========================
    // ORIGINAL FILE NAME
    // =========================

    private String originalFilename;

    // =========================
    // OLD LOCAL STORAGE PATH
    // =========================

    private String storedPath;

    // =========================
    // CLOUDINARY URL
    // =========================

    @Column(length = 2000)
    private String fileUrl;

    // =========================
    // EXTRACTED PDF TEXT
    // =========================

    @Column(columnDefinition = "TEXT")
    private String extractedText;

    // =========================
    // GETTERS & SETTERS
    // =========================

    public Long getId() {

        return id;

    }

    public void setId(Long id) {

        this.id = id;

    }

    public Long getUserId() {

        return userId;

    }

    public void setUserId(Long userId) {

        this.userId = userId;

    }

    public String getTitle() {

        return title;

    }

    public void setTitle(String title) {

        this.title = title;

    }

    public String getSubject() {

        return subject;

    }

    public void setSubject(String subject) {

        this.subject = subject;

    }

    public String getOriginalFilename() {

        return originalFilename;

    }

    public void setOriginalFilename(
            String originalFilename
    ) {

        this.originalFilename =
                originalFilename;

    }

    public String getStoredPath() {

        return storedPath;

    }

    public void setStoredPath(
            String storedPath
    ) {

        this.storedPath = storedPath;

    }

    public String getFileUrl() {

        return fileUrl;

    }

    public void setFileUrl(
            String fileUrl
    ) {

        this.fileUrl = fileUrl;

    }

    public String getExtractedText() {

        return extractedText;

    }

    public void setExtractedText(
            String extractedText
    ) {

        this.extractedText =
                extractedText;

    }

}
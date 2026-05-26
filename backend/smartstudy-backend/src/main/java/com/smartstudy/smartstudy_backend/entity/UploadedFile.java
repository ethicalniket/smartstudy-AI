
package com.smartstudy.smartstudy_backend.entity;

import jakarta.persistence.*;

import java.time.Instant;

@Entity
@Table(name = "uploaded_files")
public class UploadedFile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // stored UUID filename
    private String fileName;

    // original user filename
    private String originalFileName;

    // subject/category
    private String subject;

    // logged-in user email
    private String userEmail;

    // upload timestamp
    private Instant createdAt = Instant.now();

    // ================= GETTERS =================

    public Long getId() {
        return id;
    }

    public String getFileName() {
        return fileName;
    }

    public String getOriginalFileName() {
        return originalFileName;
    }

    public String getSubject() {
        return subject;
    }

    public String getUserEmail() {
        return userEmail;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    // ================= SETTERS =================

    public void setId(Long id) {
        this.id = id;
    }

    public void setFileName(String fileName) {
        this.fileName = fileName;
    }

    public void setOriginalFileName(String originalFileName) {
        this.originalFileName = originalFileName;
    }

    public void setSubject(String subject) {
        this.subject = subject;
    }

    public void setUserEmail(String userEmail) {
        this.userEmail = userEmail;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }
}
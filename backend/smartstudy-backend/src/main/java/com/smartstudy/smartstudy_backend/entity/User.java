package com.smartstudy.smartstudy_backend.entity;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "users")
public class User {

    // =========================
    // ID
    // =========================

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // =========================
    // EMAIL
    // =========================

    @Column(nullable = false, unique = true)
    private String email;

    // =========================
    // NAME
    // =========================

    @Column(nullable = false)
    private String name;

    // =========================
    // BIO
    // =========================

    private String bio;

    // =========================
    // PASSWORD
    // =========================

    @Column(nullable = false)
    private String password;

    // =========================
    // CREATED TIME
    // =========================

    @Column(
            name = "created_at",
            nullable = false,
            updatable = false
    )
    private Instant createdAt = Instant.now();

    // =========================
    // CONSTRUCTOR
    // =========================

    public User() {
    }

    // =========================
    // GETTERS & SETTERS
    // =========================

    public Long getId() {

        return id;

    }

    public void setId(Long id) {

        this.id = id;

    }

    public String getEmail() {

        return email;

    }

    public void setEmail(String email) {

        this.email = email;

    }

    public String getName() {

        return name;

    }

    public void setName(String name) {

        this.name = name;

    }

    public String getBio() {

        return bio;

    }

    public void setBio(String bio) {

        this.bio = bio;

    }

    public String getPassword() {

        return password;

    }

    public void setPassword(String password) {

        this.password = password;

    }

    public Instant getCreatedAt() {

        return createdAt;

    }

    public void setCreatedAt(
            Instant createdAt
    ) {

        this.createdAt = createdAt;

    }

}
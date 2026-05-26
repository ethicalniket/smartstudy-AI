package com.smartstudy.smartstudy_backend.controller;

import com.smartstudy.smartstudy_backend.entity.UploadedFile;
import com.smartstudy.smartstudy_backend.repository.UploadedFileRepository;
import com.smartstudy.smartstudy_backend.util.JwtUtil;

import jakarta.servlet.http.HttpServletRequest;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin(origins = "http://localhost:3000")
public class DashboardController {

    private final UploadedFileRepository
            uploadedFileRepository;

    private final JwtUtil jwtUtil;

    public DashboardController(

            UploadedFileRepository
                    uploadedFileRepository,

            JwtUtil jwtUtil

    ) {

        this.uploadedFileRepository =
                uploadedFileRepository;

        this.jwtUtil = jwtUtil;

    }

    private String getEmail(
            HttpServletRequest request
    ) {

        String authHeader =
                request.getHeader("Authorization");

        if (
                authHeader == null ||
                        !authHeader.startsWith("Bearer ")
        ) {

            return "guest";

        }

        String token =
                authHeader.substring(7);

        return jwtUtil.extractSubject(token);

    }

    @GetMapping("/stats")
    public ResponseEntity<?> getStats(
            HttpServletRequest request
    ) {

        try {

            String email =
                    getEmail(request);

            List<UploadedFile> files =
                    uploadedFileRepository
                            .findByUserEmail(email);

            Map<String, Object> data =
                    new HashMap<>();

            data.put(
                    "pdfCount",
                    files.size()
            );

            data.put(
                    "notesGenerated",
                    files.size() * 2
            );

            Collections.reverse(files);

            data.put(
                    "recentFiles",
                    files.stream()
                            .limit(5)
                            .toList()
            );

            return ResponseEntity.ok(data);

        } catch (Exception e) {

            e.printStackTrace();

            return ResponseEntity
                    .status(500)
                    .body("Dashboard fetch failed");

        }

    }
}
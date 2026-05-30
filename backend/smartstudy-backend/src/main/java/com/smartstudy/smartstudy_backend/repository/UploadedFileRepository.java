
package com.smartstudy.smartstudy_backend.repository;

import com.smartstudy.smartstudy_backend.entity.UploadedFile;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UploadedFileRepository
        extends JpaRepository<UploadedFile, Long> {

    List<UploadedFile> findByUserEmail(
            String userEmail
    );

    UploadedFile findByFileName(
            String fileName
    );

}
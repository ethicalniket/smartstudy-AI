//package com.smartstudy.smartstudy_backend.repository;
//
//import com.smartstudy.smartstudy_backend.entity.UploadedFile;
//import org.springframework.data.jpa.repository.JpaRepository;
//
//import java.util.List;
//
//public interface UploadedFileRepository
//        extends JpaRepository<UploadedFile, Long> {
//
//    List<UploadedFile> findByUserEmail(String userEmail);
//
//  //  void deleteByFileName(String fileName);
//  void deleteByFileNameAndUserEmail(String fileName, String userEmail);
//}
//package com.smartstudy.smartstudy_backend.repository;
//
//import com.smartstudy.smartstudy_backend.entity.UploadedFile;
//import org.springframework.data.jpa.repository.JpaRepository;
//import org.springframework.transaction.annotation.Transactional;
//
//import java.util.List;
//
//public interface UploadedFileRepository
//        extends JpaRepository<UploadedFile, Long> {
//
//    List<UploadedFile>
//    findByUserEmailOrderByCreatedAtDesc(
//            String userEmail
//    );
//
//    @Transactional
//    long deleteByFileName(String fileName);
//}
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
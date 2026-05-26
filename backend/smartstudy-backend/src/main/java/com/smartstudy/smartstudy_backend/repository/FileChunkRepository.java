package com.smartstudy.smartstudy_backend.repository;

import com.smartstudy.smartstudy_backend.entity.FileChunk;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FileChunkRepository extends JpaRepository<FileChunk, Long> {
    List<FileChunk> findByStudyFileIdOrderByPageNumberAscChunkIndexAsc(Long studyFileId);
}
//package com.smartstudy.smartstudy_backend.repository;
//
//import com.smartstudy.smartstudy_backend.entity.FileChunk;
//import org.springframework.data.jpa.repository.JpaRepository;
//
//import java.util.List;
//
//public interface FileChunkRepository
//        extends JpaRepository<FileChunk, Long> {
//
//    List<FileChunk> findByStudyFileIdOrderByPageNumberAscChunkIndexAsc(
//            Long studyFileId
//    );
//
//    List<FileChunk> findByTextContainingIgnoreCase(
//            String keyword
//    );
//}
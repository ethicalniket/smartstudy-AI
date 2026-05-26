//package com.smartstudy.smartstudy_backend.repository;
//
//import com.smartstudy.smartstudy_backend.entity.StudyFile;
//import org.springframework.data.jpa.repository.JpaRepository;
//
//public interface StudyFileRepository extends JpaRepository<StudyFile, Long> {
//}
package com.smartstudy.smartstudy_backend.repository;

import com.smartstudy.smartstudy_backend.entity.StudyFile;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;


import java.util.Optional;

public interface StudyFileRepository
        extends JpaRepository<StudyFile, Long> {

    Optional<StudyFile> findByStoredPath(
            String storedPath
    );
    List<StudyFile> findAllByStoredPathIn(
            List<String> storedPaths
    );
}
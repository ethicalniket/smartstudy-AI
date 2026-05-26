//
//package com.smartstudy.smartstudy_backend.service;
//
//import com.smartstudy.smartstudy_backend.entity.StudyFile;
//import com.smartstudy.smartstudy_backend.repository.StudyFileRepository;
//import org.springframework.beans.factory.annotation.Value;
//import org.springframework.stereotype.Service;
//import org.springframework.web.multipart.MultipartFile;
//
//import java.io.IOException;
//import java.nio.file.Files;
//import java.nio.file.Path;
//import java.nio.file.Paths;
//import java.util.UUID;
//
//@Service
//public class FileService {
//
//    private final StudyFileRepository fileRepo;
//    private final PdfService pdfService;
//
//    @Value("${app.uploads-dir:uploads}")
//    private String uploadsDir;
//
//    public FileService(
//            StudyFileRepository fileRepo,
//            PdfService pdfService
//    ) {
//        this.fileRepo = fileRepo;
//        this.pdfService = pdfService;
//    }
//
//    public StudyFile saveFile(
//            MultipartFile file,
//            Long userId,
//            String title,
//            String subject
//    ) throws IOException {
//
//        // ensure upload folder exists
//        Files.createDirectories(Paths.get(uploadsDir));
//
//        String storedName = UUID.randomUUID() + "-" + file.getOriginalFilename();
//        Path target = Paths.get(uploadsDir).resolve(storedName);
//
//        file.transferTo(target.toFile());
//
//        StudyFile studyFile = new StudyFile();
//        studyFile.setUserId(userId);
//        studyFile.setTitle(title);
//        studyFile.setSubject(subject);
//        studyFile.setOriginalFilename(file.getOriginalFilename());
//        studyFile.setStoredPath(target.toAbsolutePath().toString());
//
//        // save metadata in DB
//        StudyFile saved = fileRepo.save(studyFile);
//
//        // ❌ old code removed
//        // pdfService.extractAndSave(target.toFile(), saved);
//
//        return saved;
//    }
//}
package com.smartstudy.smartstudy_backend.service;

import com.smartstudy.smartstudy_backend.entity.StudyFile;
import com.smartstudy.smartstudy_backend.repository.StudyFileRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Service
public class FileService {

    private final StudyFileRepository fileRepo;
    private final PdfService pdfService;

    @Value("${app.uploads-dir:uploads}")
    private String uploadsDir;

    public FileService(
            StudyFileRepository fileRepo,
            PdfService pdfService
    ) {
        this.fileRepo = fileRepo;
        this.pdfService = pdfService;
    }

    public StudyFile saveFile(
            MultipartFile file,
            Long userId,
            String title,
            String subject
    ) throws IOException {

        // create uploads folder
        Files.createDirectories(Paths.get(uploadsDir));

        // unique file name
        String storedName =
                UUID.randomUUID() + "-" + file.getOriginalFilename();

        Path target =
                Paths.get(uploadsDir).resolve(storedName);

        // save physical file
        file.transferTo(target.toFile());

        // save metadata
        StudyFile studyFile = new StudyFile();
        studyFile.setUserId(userId);
        studyFile.setTitle(title);
        studyFile.setSubject(subject);
        studyFile.setOriginalFilename(file.getOriginalFilename());
        studyFile.setStoredPath(target.toAbsolutePath().toString());

        StudyFile saved = fileRepo.save(studyFile);

        // NEW: save page-wise chunks
        pdfService.extractAndSaveChunks(
                target.toFile(),
                saved
        );

        return saved;
    }
}
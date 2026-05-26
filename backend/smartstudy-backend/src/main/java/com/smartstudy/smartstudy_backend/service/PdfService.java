package com.smartstudy.smartstudy_backend.service;

import com.smartstudy.smartstudy_backend.entity.FileChunk;
import com.smartstudy.smartstudy_backend.entity.StudyFile;
import com.smartstudy.smartstudy_backend.repository.FileChunkRepository;

import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;

import org.springframework.stereotype.Service;

import java.io.File;
import java.io.IOException;

@Service
public class PdfService {

    private final FileChunkRepository chunkRepo;

    public PdfService(
            FileChunkRepository chunkRepo
    ) {

        this.chunkRepo = chunkRepo;

    }

    // =========================
// SAVE CHUNKS FROM TEXT
// =========================

    public void extractAndSaveChunksFromText(

            String text,

            StudyFile studyFile

    ) {

        if (
                text == null ||
                        text.isBlank()
        ) {

            return;

        }

        int chunkSize = 3000;

        int chunkIndex = 0;

        for (

                int start = 0;

                start < text.length();

                start += chunkSize

        ) {

            int end = Math.min(

                    start + chunkSize,

                    text.length()

            );

            String chunkText =

                    text.substring(
                            start,
                            end
                    );

            FileChunk chunk =
                    new FileChunk();

            chunk.setPageNumber(1);

            chunk.setChunkIndex(
                    chunkIndex++
            );

            chunk.setText(chunkText);

            chunk.setStudyFile(
                    studyFile
            );

            chunkRepo.save(chunk);

        }

    }


    // =========================
    // EXTRACT TEXT FROM FILE
    // =========================

    public String extractText(
            File file
    ) {

        String text = "";

        try (

                PDDocument document =

                        PDDocument.load(file)

        ) {

            PDFTextStripper stripper =
                    new PDFTextStripper();

            text =
                    stripper.getText(
                            document
                    );

        } catch (Exception e) {

            e.printStackTrace();

        }

        return text;

    }

    // =========================
    // EXTRACT TEXT FROM PDF BYTES
    // =========================

    public String extractTextFromBytes(
            byte[] pdfBytes
    ) {

        String text = "";

        try (

                PDDocument document =

                        PDDocument.load(
                                pdfBytes
                        )

        ) {

            PDFTextStripper stripper =
                    new PDFTextStripper();

            text =
                    stripper.getText(
                            document
                    );

        } catch (Exception e) {

            e.printStackTrace();

        }

        return text;

    }

    // =========================
    // SAVE PAGE-WISE CHUNKS
    // =========================

    public void extractAndSaveChunks(

            File file,

            StudyFile studyFile

    ) throws IOException {

        try (

                PDDocument document =

                        PDDocument.load(file)

        ) {

            PDFTextStripper stripper =
                    new PDFTextStripper();

            int totalPages =
                    document.getNumberOfPages();

            for (

                    int page = 1;

                    page <= totalPages;

                    page++

            ) {

                stripper.setStartPage(page);

                stripper.setEndPage(page);

                String pageText =

                        stripper
                                .getText(document)
                                .trim();

                if (
                        pageText.isBlank()
                ) {

                    continue;

                }

                FileChunk chunk =
                        new FileChunk();

                chunk.setPageNumber(page);

                chunk.setChunkIndex(0);

                chunk.setText(pageText);

                chunk.setStudyFile(
                        studyFile
                );

                chunkRepo.save(chunk);

            }

        }

    }

}
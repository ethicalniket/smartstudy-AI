
package com.smartstudy.smartstudy_backend.controller;
import java.util.UUID;
import java.io.File;
import java.util.Arrays;
import java.util.List;
import com.smartstudy.backend.dto.InterviewNextRequest;

import com.smartstudy.backend.dto.InterviewNextResponse;
import com.smartstudy.smartstudy_backend.dto.InterviewStartRequest;
import com.smartstudy.smartstudy_backend.dto.InterviewQuestionResponse;
import com.smartstudy.smartstudy_backend.entity.UploadedFile;
import com.smartstudy.smartstudy_backend.repository.UploadedFileRepository;
import com.smartstudy.smartstudy_backend.service.PdfService;
import com.smartstudy.smartstudy_backend.service.GeminiService;
import com.smartstudy.smartstudy_backend.util.JwtUtil;
import com.smartstudy.smartstudy_backend.entity.StudyFile;
import com.smartstudy.smartstudy_backend.service.FileService;
import com.smartstudy.smartstudy_backend.repository.StudyFileRepository;
import com.smartstudy.smartstudy_backend.dto.AskRequest;
import com.smartstudy.smartstudy_backend.dto.QuizRequest;
import com.smartstudy.smartstudy_backend.entity.FileChunk;
import com.smartstudy.smartstudy_backend.repository.FileChunkRepository;
import com.cloudinary.Cloudinary;
import com.smartstudy.smartstudy_backend.dto.AskAllRequest;
import com.smartstudy.smartstudy_backend.entity.ChatConversation;
import com.smartstudy.smartstudy_backend.repository.ChatConversationRepository;
import com.smartstudy.smartstudy_backend.entity.ChatMessage;
import com.smartstudy.smartstudy_backend.repository.ChatMessageRepository;
import com.smartstudy.smartstudy_backend.dto.ChatRequest;


import com.cloudinary.utils.ObjectUtils;
import jakarta.servlet.http.HttpServletRequest;
import java.util.regex.Matcher;

import java.util.regex.Pattern;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.transaction.annotation.Transactional;

import java.nio.file.*;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/upload")
@CrossOrigin(origins = "http://localhost:3000")
public class FileController {

    private static final String UPLOAD_DIR =
            System.getProperty("user.dir") + "/uploads";
    private final FileService fileService;
    private final UploadedFileRepository uploadedFileRepository;
    private final JwtUtil jwtUtil;
    private final StudyFileRepository studyFileRepository;
    private final FileChunkRepository fileChunkRepository;
    private final PdfService pdfService;
    private final Cloudinary cloudinary;
    private final GeminiService geminiService;
    private final ChatConversationRepository chatConversationRepository;
    private final ChatMessageRepository chatMessageRepository;

    public FileController(
            UploadedFileRepository uploadedFileRepository,
            JwtUtil jwtUtil,
            FileService fileService,
            Cloudinary cloudinary,
            PdfService pdfService,
            StudyFileRepository studyFileRepository,
            FileChunkRepository fileChunkRepository,
            GeminiService geminiService,
            ChatConversationRepository chatConversationRepository,
            ChatMessageRepository chatMessageRepository
    ) {
        this.uploadedFileRepository = uploadedFileRepository;
        this.jwtUtil = jwtUtil;
        this.pdfService = pdfService;
        this.studyFileRepository = studyFileRepository;
        this.fileChunkRepository = fileChunkRepository;
        this.geminiService = geminiService;
        this.fileService = fileService;
        this.cloudinary = cloudinary;
        this.chatConversationRepository =
                chatConversationRepository;
        this.chatMessageRepository =
                chatMessageRepository;
    }

    // =========================
    // COMMON HELPERS
    // =========================
    private String getEmail(HttpServletRequest request) {

        String authHeader = request.getHeader("Authorization");

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return "guest";
        }

        String token = authHeader.substring(7);

        return jwtUtil.extractSubject(token);
    }

    private Path getFilePath(String filename) {
        return Paths.get(UPLOAD_DIR).resolve(filename);
    }

    private String extractText(String filename) throws Exception {

        Path path = getFilePath(filename);

        if (!Files.exists(path)) {
            throw new RuntimeException("File not found");
        }

        return pdfService.extractText(path.toFile());
    }

    // =========================
    // UPLOAD PDF
    // =========================

    @PostMapping
    public ResponseEntity<?> uploadPdf(
            @RequestParam("file") MultipartFile file,
            @RequestParam("subject") String subject,
            HttpServletRequest request
    ) {

        try {

            if (file.isEmpty()) {

                return ResponseEntity
                        .badRequest()
                        .body("File empty");

            }

            // =========================
            // PDF VALIDATION
            // =========================

            if (
                    !file.getContentType()
                            .equals("application/pdf")
            ) {

                return ResponseEntity
                        .badRequest()
                        .body(
                                "Only PDF allowed"
                        );

            }

            // =========================
            // FILE SIZE VALIDATION
            // =========================

            if (
                    file.getSize() >
                            10 * 1024 * 1024
            ) {

                return ResponseEntity
                        .badRequest()
                        .body(
                                "File too large"
                        );

            }

            // =========================
            // TEMP FILE
            // =========================

            File tempFile = File.createTempFile(
                    "upload-",
                    ".pdf"
            );

            file.transferTo(tempFile);

            // =========================
            // UNIQUE FILE NAME
            // =========================

            String fileName =

                    UUID.randomUUID()
                            + "-"
                            + file.getOriginalFilename();

            // =========================
            // CLOUDINARY UPLOAD
            // =========================

            Map uploadResult =

                    cloudinary.uploader().upload(

                            tempFile,

                            ObjectUtils.asMap(

                                    "resource_type",
                                    "raw",

                                    "folder",
                                    "smartstudy-pdfs",

                                    "format",
                                    "pdf",

                                    "use_filename",
                                    true,

                                    "unique_filename",
                                    true

                            )

                    );

            String fileUrl =

                    uploadResult
                            .get("secure_url")
                            .toString();

            String publicId =

                    uploadResult
                            .get("public_id")
                            .toString();

            // =========================
            // SAVE UPLOADED FILE
            // =========================

            UploadedFile uploadedFile =
                    new UploadedFile();

            uploadedFile.setFileName(
                    fileUrl
            );

            uploadedFile.setOriginalFileName(
                    file.getOriginalFilename()
            );

            uploadedFile.setSubject(
                    subject
            );

            uploadedFile.setUserEmail(
                    getEmail(request)
            );

            uploadedFileRepository.save(
                    uploadedFile
            );

            // =========================
            // SAVE STUDY FILE
            // =========================

            StudyFile studyFile =
                    new StudyFile();

            studyFile.setTitle(
                    file.getOriginalFilename()
            );

            studyFile.setOriginalFilename(
                    file.getOriginalFilename()
            );

            studyFile.setStoredPath(
                    fileUrl
            );

            studyFile.setFileUrl(
                    fileUrl
            );

            studyFile.setSubject(
                    subject
            );

            // =========================
            // EXTRACT PDF TEXT
            // =========================

            String extractedText =

                    pdfService.extractText(
                            tempFile
                    );

            // LIMIT HUGE PDFs

            if (
                    extractedText.length() >
                            50000
            ) {

                extractedText =

                        extractedText.substring(
                                0,
                                50000
                        );

            }

            // SAVE TEXT

            studyFile.setExtractedText(
                    extractedText
            );

            studyFileRepository.save(
                    studyFile
            );

            // =========================
            // SAVE FILE CHUNKS
            // =========================

            pdfService.extractAndSaveChunks(
                    tempFile,
                    studyFile
            );

            // =========================
            // DELETE TEMP FILE
            // =========================

            tempFile.delete();

            // =========================
            // RESPONSE
            // =========================

            return ResponseEntity.ok(

                    Map.of(

                            "fileUrl",
                            fileUrl,

                            "publicId",
                            publicId

                    )

            );

        } catch (Exception e) {

            e.printStackTrace();

            return ResponseEntity
                    .status(500)
                    .body("Upload failed");

        }

    }
    // =========================
    // LIST FILES
    // =========================

    @GetMapping("/files")
    public ResponseEntity<?> listFiles(
            HttpServletRequest request
    ) {

        try {

            String email = getEmail(request);

            List<Map<String, String>> files =
                    uploadedFileRepository
                            .findByUserEmail(email)
                            .stream()
                            .map(file -> Map.of(
                                    "fileName", file.getFileName(),
                                    "originalFileName", file.getOriginalFileName(),
                                    "subject", file.getSubject()
                            ))
                            .collect(Collectors.toList());

            return ResponseEntity.ok(files);

        } catch (Exception e) {

            e.printStackTrace();

            return ResponseEntity.status(500)
                    .body("Fetch failed");
        }
    }
    // =========================
    // OPEN PDF
    // =========================
    @GetMapping(value = "/files/{filename:.+}", produces = MediaType.APPLICATION_PDF_VALUE)
    public ResponseEntity<?> openFile(@PathVariable String filename) {

        try {

            Path path = getFilePath(filename);

            if (!Files.exists(path)) {
                return ResponseEntity.notFound().build();
            }

            byte[] file = Files.readAllBytes(path);

            return ResponseEntity.ok(file);

        } catch (Exception e) {

            e.printStackTrace();
            return ResponseEntity.status(500).body("Open failed");

        }
    }

    // =========================
    // DELETE FILE
    // =========================

    @DeleteMapping("/files")
    public ResponseEntity<?> deleteFile(

            @RequestBody Map<String, String> body

    ) {

        try {

            String fileUrl =

                    body.get("fileUrl");

            if (
                    fileUrl == null ||
                            fileUrl.isEmpty()
            ) {

                return ResponseEntity
                        .badRequest()
                        .body(
                                "File URL missing"
                        );

            }

            // =========================
            // FIND FILE
            // =========================

            UploadedFile uploadedFile =

                    uploadedFileRepository
                            .findByFileName(
                                    fileUrl
                            );

            if (uploadedFile == null) {

                return ResponseEntity
                        .status(404)
                        .body(
                                "File not found"
                        );

            }

            // =========================
            // EXTRACT PUBLIC ID
            // =========================

            String publicId =

                    fileUrl
                            .substring(

                                    fileUrl.indexOf(
                                            "smartstudy-pdfs/"
                                    )

                            )

                            .replace(
                                    ".pdf",
                                    ""
                            );

            // =========================
            // DELETE CLOUDINARY FILE
            // =========================

            cloudinary.uploader().destroy(

                    publicId,

                    ObjectUtils.asMap(
                            "resource_type",
                            "raw"
                    )

            );

            // =========================
// DELETE DB RECORD
// =========================

            uploadedFileRepository
                    .delete(uploadedFile);

            studyFileRepository
                    .findByStoredPath(fileUrl)
                    .ifPresent(
                            studyFileRepository::delete
                    );

            return ResponseEntity.ok(
                    "File deleted"
            );
        } catch (Exception e) {

            e.printStackTrace();

            return ResponseEntity
                    .status(500)
                    .body(
                            "Delete failed"
                    );

        }

    }
    // =========================
    // ASK FROM PDF
    // =========================
    @Transactional
    @PostMapping("/ask")
    public ResponseEntity<?> askPDF(
            @RequestBody AskRequest request
    ) {

        try {

            // ================= FIND PDF =================

            StudyFile studyFile =
                    studyFileRepository
                            .findByStoredPath(
                                    request.getFileName()
                            )
                            .orElseThrow(
                                    () -> new RuntimeException(
                                            "PDF not found"
                                    )
                            );

            // ================= GET CHUNKS =================

            List<FileChunk> chunks =
                    fileChunkRepository
                            .findByStudyFileIdOrderByPageNumberAscChunkIndexAsc(
                                    studyFile.getId()
                            );

            // ================= QUESTION =================

            String question =
                    request.getQuestion()
                            .toLowerCase();

            // ================= FIND RELEVANT CHUNKS =================

            List<FileChunk> relevantChunks =
                    chunks.stream()

                            .sorted((a, b) -> {

                                int scoreA = 0;
                                int scoreB = 0;

                                String textA =
                                        a.getText()
                                                .toLowerCase();

                                String textB =
                                        b.getText()
                                                .toLowerCase();

                                for (
                                        String word :
                                        question.split(" ")
                                ) {

                                    if (
                                            textA.contains(word)
                                    ) {
                                        scoreA++;
                                    }

                                    if (
                                            textB.contains(word)
                                    ) {
                                        scoreB++;
                                    }

                                }

                                return Integer.compare(
                                        scoreB,
                                        scoreA
                                );

                            })

                            .limit(15)

                            .toList();

            // ================= BUILD CONTEXT =================

            StringBuilder context =
                    new StringBuilder();

            for (
                    FileChunk chunk :
                    relevantChunks
            ) {

                context.append(
                        chunk.getText()
                );

                context.append("\n\n");

            }

            // ================= STRONG PROMPT =================

            String prompt = """

You are SmartStudy AI,
an advanced AI study assistant.

STRICT RULES:

1. Answer from the provided PDF notes as accurately as possible.
2. Try your best to answer using the available context.
3. If partial information exists, explain using the available notes.
4. Only say "Answer not found in uploaded notes"
when absolutely no relevant information exists.
5. Give educational and detailed answers.
6. Use bullet points where useful.
7. Keep response clean and easy to understand.
8. Do NOT make up completely unrelated information.
9. Explain in simple student-friendly language.
10. By default answer in English.
11. If user asks in Hindi, answer in Hindi.
12. If user asks in Hinglish, answer in Hinglish.
13. Follow the language explicitly requested by the user.
14. Never return corrupted Unicode text.
15. Format code using markdown code blocks.

USER QUESTION:
""" + request.getQuestion() +

                    """
    
    PDF CONTEXT:
    """ + context +

                    """
    
    FINAL ANSWER:
    """;

            // ================= GEMINI =================

            String answer =
                    geminiService
                            .generateContent(prompt);

            // ================= RESPONSE =================

            return ResponseEntity.ok(
                    Map.of(
                            "answer",
                            answer
                    )
            );

        } catch (Exception e) {

            e.printStackTrace();

            return ResponseEntity
                    .status(500)
                    .body(
                            Map.of(
                                    "error",
                                    "Question answering failed"
                            )
                    );

        }

    }


    // =========================
    // InterviewController API
    // =========================
    @Transactional
    @PostMapping("/interview/start")
    public ResponseEntity<?> startInterview(

            @RequestBody
            InterviewStartRequest request

    ) {

        try {

            List<String> fileNames =
                    request.getFileNames();

            List<StudyFile> studyFiles;

            // ================= LOAD FILES =================

            if (

                    fileNames.contains("ALL")

            ) {

                studyFiles =
                        studyFileRepository.findAll();

            } else {

                studyFiles =
                        studyFileRepository
                                .findAllByStoredPathIn(
                                        fileNames
                                );

            }

            // ================= BUILD CONTEXT =================

            StringBuilder context =
                    new StringBuilder();

            for (
                    StudyFile file :
                    studyFiles
            ) {

                List<FileChunk> chunks =

                        fileChunkRepository
                                .findByStudyFileIdOrderByPageNumberAscChunkIndexAsc(
                                        file.getId()
                                );

                chunks.stream()

                        .limit(10)

                        .forEach(chunk -> {

                            System.out.println(
                                    "CHUNK TEXT = "
                                            +
                                            chunk.getText()
                            );

                            context.append(
                                    chunk.getText()
                            );

                            context.append("\n\n");

                        });
            }

            // ================= PROMPT =================

            String prompt =

                    "You are an AI technical interviewer.\n\n"

                            +

                            "Generate "

                            +

                            request.getQuestionLimit()

                            +

                            " interview questions from the provided study material.\n\n"

                            +

                            "RULES:\n"

                            +

                            "1. Questions should test understanding.\n"

                            +

                            "2. Include theory + practical concepts.\n"

                            +

                            "3. Keep questions student-friendly.\n"

                            +

                            "4. Avoid repeated questions.\n"

                            +

                            "5. Include medium difficulty questions.\n"

                            +

                            "6. Return only questions.\n";


            // ================= GEMINI =================

            String finalPrompt =

                    prompt +

                            "\n\nSTUDY MATERIAL:\n\n"

                            +

                            context.toString();

            String response =

                    geminiService
                            .generateContent(
                                    finalPrompt
                            );
            // ================= SPLIT QUESTIONS =================

            List<String> questions =

                    Arrays.stream(
                                    response.split("\n")
                            )

                            .filter(
                                    q -> !q.trim().isEmpty()
                            )

                            .toList();

            // ================= RESPONSE =================

            return ResponseEntity.ok(

                    new InterviewQuestionResponse(
                            questions
                    )

            );

        } catch (Exception e) {

            e.printStackTrace();

            return ResponseEntity

                    .status(500)

                    .body(

                            Map.of(
                                    "error",
                                    "Interview generation failed"
                            )

                    );

        }

    }
    @PostMapping("/interview/next")
    public ResponseEntity<?> nextInterviewQuestion(

            @RequestBody
            InterviewNextRequest request

    ) {

        try {

            String prompt;

            if (
                    request.isSkipped()
            ) {

                prompt = """

You are an AI technical interviewer.

The student skipped the question.

1. Explain the concept briefly.
2. Keep explanation student-friendly.
3. Maximum 7 lines only.
4. Then generate ONE next interview question.
FORMAT:

FEEDBACK:
...

NEXT:
...

QUESTION:
""" +

                        request.getCurrentQuestion();

            } else {

                prompt = """

You are an expert AI technical interviewer.

Evaluate the student's answer carefully.

RULES:

1. Analyze what the student tried to answer.
2. Mention correct understanding if any.
3. Mention mistakes clearly.
4. Explain improvements simply.
5. Give a proper ideal answer.
6. Keep response concise but meaningful.
7. If answer is random or nonsense, score = 0.
8. Score must depend on answer quality only.

RETURN FORMAT EXACTLY:

EVALUATION:
Strengths:
...

Mistakes:
...

Improvements:
...

IDEAL ANSWER:
...

SCORE:
...

NEXT QUESTION:
...

QUESTION:
"""

                        +

                        "\n\nQUESTION:\n"

                        +

                        request.getCurrentQuestion()

                        +

                        "\n\nSTUDENT ANSWER:\n"

                        +

                        request.getAnswer();
            }

            String aiResponse =

                    geminiService
                            .generateContent(
                                    prompt
                            );

            aiResponse = aiResponse

                    .replace("â€”", "-")

                    .replace("â€", "\"");
            // ================= PARSE =================

            String feedback = aiResponse;

            String nextQuestion =
                    "Explain another concept from the notes.";

            int score = 0;

            try {

                Pattern pattern = Pattern.compile(
                        "SCORE:\\s*(\\d+)"
                );

                Matcher matcher =
                        pattern.matcher(aiResponse);

                if (
                        matcher.find()
                ) {

                    score = Integer.parseInt(
                            matcher.group(1)
                    );

                }

            } catch (Exception e) {

                score = 0;

            }
            // crude parsing

            if (
                    aiResponse.contains(
                            "NEXT:"
                    )
            ) {

                String[] parts =
                        aiResponse.split(
                                "NEXT:"
                        );

                feedback = parts[0];

                nextQuestion =
                        parts[1];

            }

            return ResponseEntity.ok(

                    new InterviewNextResponse(

                            feedback,

                            nextQuestion,

                            score

                    )

            );

        } catch (Exception e) {

            e.printStackTrace();

            return ResponseEntity.status(500)

                    .body(

                            Map.of(

                                    "error",

                                    "Interview next failed"

                            )

                    );

        }

    }
    // =========================
    // CHATBOT ASK ALL
    // =========================
    @PostMapping("/ask-all")
    public ResponseEntity<?> askAllPdfs(
            @RequestBody AskAllRequest request,
            HttpServletRequest httpRequest
    ) {

        try {

            List<FileChunk> chunks =
                    fileChunkRepository.findAll();

            String question =
                    request.getQuestion()
                            .toLowerCase();

            List<FileChunk> relevantChunks =
                    chunks.stream()

                            .sorted((a, b) -> {

                                int scoreA = 0;
                                int scoreB = 0;

                                String textA =
                                        a.getText()
                                                .toLowerCase();

                                String textB =
                                        b.getText()
                                                .toLowerCase();

                                for (
                                        String word :
                                        question.split(" ")
                                ) {

                                    if (
                                            textA.contains(word)
                                    ) {
                                        scoreA++;
                                    }

                                    if (
                                            textB.contains(word)
                                    ) {
                                        scoreB++;
                                    }

                                }

                                return Integer.compare(
                                        scoreB,
                                        scoreA
                                );

                            })

                            .limit(20)

                            .toList();

            StringBuilder context =
                    new StringBuilder();

            for (
                    FileChunk chunk :
                    relevantChunks
            ) {

                context.append(
                        chunk.getText()
                );

                context.append("\n\n");
            }

            String prompt = """

You are SmartStudy AI.

Rules:

1. By default answer in English.
2. If user asks in Hindi, answer in Hindi.
3. If user asks in Hinglish, answer in Hinglish.
4. If user explicitly requests a language, use that language.
5. Never return corrupted Unicode text.
6. Format code using markdown code blocks.
7. Use headings, bullet points and examples when useful.

Use only the uploaded study notes.

If information exists across multiple PDFs,
combine it into one answer.


Question:
""" + request.getQuestion() +

                    """
    
    Study Notes:
    """ + context +

                    """
    
    Answer:
    """;

            String answer =
                    geminiService
                            .generateContent(prompt);
            String token =
                    httpRequest.getHeader(
                            "Authorization"
                    );

            token =
                    token.replace(
                            "Bearer ",
                            ""
                    );

            String email =
                    jwtUtil.extractSubject(
                            token
                    );

            ChatConversation conversation =
                    new ChatConversation();

            conversation.setUserEmail(
                    email
            );

            String title =
                    request.getQuestion();

            if (title.length() > 50) {

                title =
                        title.substring(
                                0,
                                50
                        ) + "...";
            }

            conversation.setTitle(
                    title
            );

            conversation =
                    chatConversationRepository
                            .save(conversation);

            ChatMessage userMessage =
                    new ChatMessage();

            userMessage.setConversationId(
                    conversation.getId()
            );

            userMessage.setRole(
                    "USER"
            );

            userMessage.setContent(
                    request.getQuestion()
            );

            chatMessageRepository
                    .save(userMessage);

            ChatMessage aiMessage =
                    new ChatMessage();

            aiMessage.setConversationId(
                    conversation.getId()
            );

            aiMessage.setRole(
                    "AI"
            );

            aiMessage.setContent(
                    answer
            );

            chatMessageRepository
                    .save(aiMessage);
            return ResponseEntity.ok(
                    Map.of(
                            "answer",
                            answer
                    )
            );

        } catch (Exception e) {

            e.printStackTrace();

            return ResponseEntity
                    .status(500)
                    .body(
                            Map.of(
                                    "error",
                                    "Failed to answer"
                            )
                    );
        }
    }
    @GetMapping("/chat-history")
    public ResponseEntity<?> chatHistory(
            HttpServletRequest request
    ) {

        try {

            String token =
                    request.getHeader(
                            "Authorization"
                    );

            token =
                    token.replace(
                            "Bearer ",
                            ""
                    );

            String email =
                    jwtUtil.extractSubject(
                            token
                    );

            return ResponseEntity.ok(

                    chatConversationRepository
                            .findByUserEmailOrderByCreatedAtDesc(
                                    email
                            )

            );

        } catch (Exception e) {

            return ResponseEntity
                    .status(500)
                    .body(
                            Map.of(
                                    "error",
                                    "Failed"
                            )
                    );
        }
    }
    @GetMapping("/conversations")
    public ResponseEntity<?> conversations(
            HttpServletRequest request
    ) {

        try {

            String token =
                    request.getHeader(
                            "Authorization"
                    );

            token =
                    token.replace(
                            "Bearer ",
                            ""
                    );

            String email =
                    jwtUtil.extractSubject(
                            token
                    );

            return ResponseEntity.ok(

                    chatConversationRepository
                            .findByUserEmailOrderByCreatedAtDesc(
                                    email
                            )

            );

        } catch (Exception e) {

            e.printStackTrace();

            return ResponseEntity
                    .status(500)
                    .body(
                            Map.of(
                                    "error",
                                    "Failed"
                            )
                    );
        }
    }
    @GetMapping("/conversation/{id}")
    public ResponseEntity<?> conversation(
            @PathVariable Long id
    ) {

        try {

            return ResponseEntity.ok(

                    chatMessageRepository
                            .findByConversationIdOrderByCreatedAtAsc(
                                    id
                            )

            );

        } catch (Exception e) {

            e.printStackTrace();

            return ResponseEntity
                    .status(500)
                    .body(
                            Map.of(
                                    "error",
                                    "Failed"
                            )
                    );
        }
    }
    @Transactional
    @DeleteMapping("/conversation/{id}")
    public ResponseEntity<?> deleteConversation(
            @PathVariable Long id
    ) {

        try {

            chatMessageRepository
                    .deleteByConversationId(
                            id
                    );

            chatConversationRepository
                    .deleteById(
                            id
                    );

            return ResponseEntity.ok(
                    Map.of(
                            "message",
                            "Deleted"
                    )
            );

        } catch (Exception e) {

            e.printStackTrace();

            return ResponseEntity
                    .status(500)
                    .body(
                            Map.of(
                                    "error",
                                    "Delete failed"
                            )
                    );
        }
    }
    // =========================
    // CHAT API
    // =========================
    @PostMapping("/chat")
    public ResponseEntity<?> continueChat(
            @RequestBody ChatRequest request,
            HttpServletRequest httpRequest
    ) {

        try {

            ChatConversation conversation =
                    chatConversationRepository
                            .findById(
                                    request.getConversationId()
                            )
                            .orElseThrow(
                                    () -> new RuntimeException(
                                            "Conversation not found"
                                    )
                            );

            String token =
                    httpRequest.getHeader(
                            "Authorization"
                    );

            token =
                    token.replace(
                            "Bearer ",
                            ""
                    );

            String email =
                    jwtUtil.extractSubject(
                            token
                    );

            if (
                    conversation.getUserEmail() == null
            ) {

                conversation.setUserEmail(
                        email
                );

                chatConversationRepository
                        .save(conversation);

            }
            else if (
                    !conversation
                            .getUserEmail()
                            .equals(email)
            ) {

                return ResponseEntity
                        .status(403)
                        .body(
                                Map.of(
                                        "error",
                                        "Access denied"
                                )
                        );
            }

            List<ChatMessage> oldMessages =
                    chatMessageRepository
                            .findByConversationIdOrderByCreatedAtAsc(
                                    conversation.getId()
                            );

            StringBuilder history =
                    new StringBuilder();

            for (
                    ChatMessage msg :
                    oldMessages
            ) {

                history.append(
                        msg.getRole()
                );

                history.append(": ");

                history.append(
                        msg.getContent()
                );

                history.append("\n");
            }

            List<FileChunk> chunks =
                    fileChunkRepository
                            .findAll();

            String question =
                    request.getQuestion()
                            .toLowerCase();

            List<FileChunk> relevantChunks =
                    chunks.stream()

                            .sorted((a, b) -> {

                                int scoreA = 0;
                                int scoreB = 0;

                                String textA =
                                        a.getText()
                                                .toLowerCase();

                                String textB =
                                        b.getText()
                                                .toLowerCase();

                                for (
                                        String word :
                                        question.split(" ")
                                ) {

                                    if (
                                            textA.contains(word)
                                    ) scoreA++;

                                    if (
                                            textB.contains(word)
                                    ) scoreB++;
                                }

                                return Integer.compare(
                                        scoreB,
                                        scoreA
                                );

                            })

                            .limit(20)

                            .toList();

            StringBuilder context =
                    new StringBuilder();

            for (
                    FileChunk chunk :
                    relevantChunks
            ) {

                context.append(
                        chunk.getText()
                );

                context.append("\n\n");
            }

            String prompt = """

You are SmartStudy AI.

Continue the conversation naturally.
Rules:

1. By default answer in English.
2. If user asks in Hindi, answer in Hindi.
3. If user asks in Hinglish, answer in Hinglish.
4. If user explicitly requests a language, use that language.
5. Never return corrupted Unicode text.
6. Format code using markdown code blocks.
7. Use headings and bullet points when useful.

Previous Conversation:
""" + history +

                    """
    
    Study Notes:
    """ + context +

                    """
    
    User:
    """ + request.getQuestion() +

                    """
    
    Answer:
    """;

            String answer =
                    geminiService
                            .generateContent(prompt);

            ChatMessage userMessage =
                    new ChatMessage();

            userMessage.setConversationId(
                    conversation.getId()
            );

            userMessage.setRole(
                    "USER"
            );

            userMessage.setContent(
                    request.getQuestion()
            );

            chatMessageRepository
                    .save(userMessage);

            ChatMessage aiMessage =
                    new ChatMessage();

            aiMessage.setConversationId(
                    conversation.getId()
            );

            aiMessage.setRole(
                    "AI"
            );

            aiMessage.setContent(
                    answer
            );

            chatMessageRepository
                    .save(aiMessage);

            return ResponseEntity.ok(
                    Map.of(
                            "answer",
                            answer
                    )
            );

        } catch (Exception e) {

            e.printStackTrace();

            return ResponseEntity
                    .status(500)
                    .body(
                            Map.of(
                                    "error",
                                    "Chat failed"
                            )
                    );
        }
    }

    // =========================
    // BASIC AI SUMMARY
    // =========================
    //@GetMapping("/summary/{filename:.+}")
    @PostMapping("/summary")
    public ResponseEntity<?> summary(
            @RequestBody Map<String, String> body
    ) {

        try {

            // ================= EXTRACT TEXT =================
            String filename =

                    body.get("fileUrl");
            // ================= FIND STUDY FILE =================

            StudyFile studyFile =

                    studyFileRepository
                            .findByStoredPath(
                                    filename
                            )

                            .orElseThrow(

                                    () -> new RuntimeException(
                                            "PDF not found"
                                    )

                            );

// ================= USE SAVED TEXT =================

            String text =

                    studyFile.getExtractedText();

            // LIMIT HUGE PDFs

            if (text.length() > 12000) {

                text =
                        text.substring(
                                0,
                                12000
                        );

            }

            // ================= AI PROMPT =================

            String prompt = """

You are SmartStudy AI.

Generate a HIGH-QUALITY study summary
from the PDF notes.

RULES:

1. Explain in simple student-friendly language.
2. Use headings and bullet points.
3. Include only important concepts.
4. Make the summary useful for revision.
5. Highlight important definitions and concepts.
6. Avoid unnecessary repetition.
7. Keep formatting clean and readable.

OUTPUT FORMAT:

# Topic Overview

# Important Concepts

# Key Definitions

# Exam Important Points

PDF CONTENT:
""" + text;

            // ================= GEMINI =================

            String aiSummary =
                    geminiService
                            .generateContent(prompt);

            // ================= RESPONSE =================

            return ResponseEntity.ok(

                    Map.of(
                            "summary",
                            aiSummary
                    )

            );

        } catch (Exception e) {

            e.printStackTrace();

            return ResponseEntity
                    .status(500)
                    .body(
                            "Summary failed"
                    );

        }

    }
    //========================
    // QUIZ
    //========================
    @PostMapping("/questions")
    public ResponseEntity<?> generateQuestions(
            @RequestBody QuizRequest request
    ) {

        try {

            // ================= EXTRACT TEXT =================

            // ================= FIND STUDY FILE =================

            StudyFile studyFile =

                    studyFileRepository
                            .findByStoredPath(
                                    request.getFileName()
                            )

                            .orElseThrow(

                                    () -> new RuntimeException(
                                            "PDF not found"
                                    )

                            );

// ================= USE SAVED TEXT =================

            String text =

                    studyFile.getExtractedText();

            // LIMIT HUGE PDFs

            if (text.length() > 12000) {

                text =
                        text.substring(
                                0,
                                12000
                        );

            }

            // ================= QUIZ TYPE =================

            String type =
                    request.getType()
                            .toLowerCase();

            String prompt = "";

            // ================= MCQ =================

            if (type.equals("mcq")) {

                prompt = """

You are SmartStudy AI.

Generate 5 multiple choice questions
from the PDF notes.

IMPORTANT RULES:

1. Return ONLY valid JSON.
2. Do NOT add markdown.
3. Do NOT write anything outside JSON.
4. Each question must contain:
   - question
   - options
   - answer
   - explanation
5. Explanation must be short and student-friendly.
6. Each question must have exactly 4 options.

JSON FORMAT:

[
  {
    "question":"Question here",

    "options":[
      "Option 1",
      "Option 2",
      "Option 3",
      "Option 4"
    ],

    "answer":"Correct option",

    "explanation":"Short explanation here"
  }
]

PDF CONTENT:
""" + text;
            }

            // ================= SUBJECTIVE =================

            else if (
                    type.equals("subjective")
            ) {

                prompt = """

You are SmartStudy AI.

Generate 5 subjective theory questions
from the PDF notes.

RULES:
1. Questions should be detailed.
2. Questions should be exam-oriented.
3. Focus on important concepts.

PDF CONTENT:
""" + text;

            }

            // ================= VIVA =================

            else if (
                    type.equals("viva")
            ) {

                prompt = """

You are SmartStudy AI.

Generate 10 viva/interview questions
with answers from the PDF notes.

RULES:
1. Keep answers concise.
2. Questions should test understanding.
3. Use student-friendly language.

FORMAT:

Q:
question

Answer:
answer

PDF CONTENT:
""" + text;

            }

            // ================= INVALID TYPE =================

            else {

                return ResponseEntity
                        .badRequest()
                        .body(
                                "Invalid quiz type"
                        );

            }

            // ================= GEMINI =================

            String result =
                    geminiService
                            .generateContent(prompt);

            // ================= RESPONSE =================

            return ResponseEntity.ok(

                    Map.of(
                            "questions",
                            result
                    )

            );

        } catch (Exception e) {

            e.printStackTrace();

            return ResponseEntity
                    .status(500)
                    .body(
                            "Question generation failed"
                    );

        }

    }
    // =========================
    // 🚀 REAL AI (GEMINI)
    // =========================
    @Transactional
    @PostMapping("/process")
    public ResponseEntity<?> processFile(

            @RequestBody Map<String, String> body

    ) {

        try {
            String filename =

                    body.get("fileUrl");




            // ================= FIND EXISTING STUDY FILE =================

            StudyFile studyFile =
                    studyFileRepository
                            .findByStoredPath(
                                    filename
                            )
                            .orElseThrow(
                                    () ->
                                            new RuntimeException(
                                                    "StudyFile not found"
                                            )
                            );

            // ================= PREVENT DUPLICATE PROCESSING =================

            List<FileChunk> existingChunks =
                    fileChunkRepository
                            .findByStudyFileIdOrderByPageNumberAscChunkIndexAsc(
                                    studyFile.getId()
                            );

            if (!existingChunks.isEmpty()) {

                return ResponseEntity.ok(

                        Map.of(
                                "message",
                                "File already processed"
                        )

                );

            }

            // ================= PROCESS PDF =================

            pdfService.extractAndSaveChunksFromText(

                    studyFile.getExtractedText(),

                    studyFile

            );

            // ================= RESPONSE =================

            return ResponseEntity.ok(

                    Map.of(
                            "message",
                            "AI processing completed",
                            "file",
                            filename
                    )

            );

        } catch (Exception e) {

            e.printStackTrace();

            return ResponseEntity
                    .status(500)
                    .body(
                            "Processing failed: "
                                    + e.getMessage()
                    );

        }

    }
}

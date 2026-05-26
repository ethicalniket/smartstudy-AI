package com.smartstudy.smartstudy_backend.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "file_chunks")
public class FileChunk {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Integer pageNumber;

    private Integer chunkIndex;

    @Lob
    @Column(columnDefinition = "text")
    private String text;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "study_file_id")
    private StudyFile studyFile;

    // getters/setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Integer getPageNumber() { return pageNumber; }
    public void setPageNumber(Integer pageNumber) { this.pageNumber = pageNumber; }

    public Integer getChunkIndex() { return chunkIndex; }
    public void setChunkIndex(Integer chunkIndex) { this.chunkIndex = chunkIndex; }

    public String getText() { return text; }
    public void setText(String text) { this.text = text; }

    public StudyFile getStudyFile() { return studyFile; }
    public void setStudyFile(StudyFile studyFile) { this.studyFile = studyFile; }
}
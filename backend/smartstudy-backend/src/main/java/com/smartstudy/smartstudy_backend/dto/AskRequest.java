package com.smartstudy.smartstudy_backend.dto;

public class AskRequest {

    private String question;

    private String fileName;

    public String getQuestion() {
        return question;
    }

    public String getFileName() {
        return fileName;
    }

    public void setQuestion(String question) {
        this.question = question;
    }

    public void setFileName(String fileName) {
        this.fileName = fileName;
    }

}
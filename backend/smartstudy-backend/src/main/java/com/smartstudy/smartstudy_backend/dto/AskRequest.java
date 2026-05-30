package com.smartstudy.smartstudy_backend.dto;

public class AskRequest {

    private String question;

    private String fileName;

    private String chatId;

    public String getQuestion() {
        return question;
    }

    public String getFileName() {
        return fileName;
    }

    public String getChatId() {
        return chatId;
    }

    public void setQuestion(String question) {
        this.question = question;
    }

    public void setFileName(String fileName) {
        this.fileName = fileName;
    }

    public void setChatId(String chatId) {
        this.chatId = chatId;
    }
}
package com.smartstudy.smartstudy_backend.dto;

public class ChatRequest {

    private Long conversationId;

    private String question;

    public Long getConversationId() {
        return conversationId;
    }

    public void setConversationId(Long conversationId) {
        this.conversationId = conversationId;
    }

    public String getQuestion() {
        return question;
    }

    public void setQuestion(String question) {
        this.question = question;
    }
}
package com.smartstudy.smartstudy_backend.dto;

import java.util.List;

public class InterviewQuestionResponse {

    private List<String> questions;

    public InterviewQuestionResponse(
            List<String> questions
    ) {
        this.questions = questions;
    }

    public List<String> getQuestions() {
        return questions;
    }

    public void setQuestions(
            List<String> questions
    ) {
        this.questions = questions;
    }
}
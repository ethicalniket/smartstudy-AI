package com.smartstudy.backend.dto;

public class InterviewNextRequest {

    private String currentQuestion;

    private String answer;

    private boolean skipped;

    public String getCurrentQuestion() {
        return currentQuestion;
    }

    public void setCurrentQuestion(
            String currentQuestion
    ) {
        this.currentQuestion =
                currentQuestion;
    }

    public String getAnswer() {
        return answer;
    }

    public void setAnswer(
            String answer
    ) {
        this.answer = answer;
    }

    public boolean isSkipped() {
        return skipped;
    }

    public void setSkipped(
            boolean skipped
    ) {
        this.skipped = skipped;
    }

}
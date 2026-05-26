package com.smartstudy.backend.dto;

public class InterviewNextResponse {

    private String feedback;

    private String nextQuestion;

    private int score;

    public InterviewNextResponse(
            String feedback,
            String nextQuestion,
            int score
    ) {

        this.feedback = feedback;

        this.nextQuestion =
                nextQuestion;

        this.score = score;

    }

    public String getFeedback() {
        return feedback;
    }

    public String getNextQuestion() {
        return nextQuestion;
    }

    public int getScore() {
        return score;
    }

}
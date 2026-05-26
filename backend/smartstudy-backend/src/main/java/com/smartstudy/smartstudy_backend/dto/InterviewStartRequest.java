package com.smartstudy.smartstudy_backend.dto;

import java.util.List;

public class InterviewStartRequest {

    private List<String> fileNames;

    public List<String> getFileNames() {
        return fileNames;
    }

    public void setFileNames(
            List<String> fileNames
    ) {
        this.fileNames = fileNames;
    }
    private int questionLimit;

    public int getQuestionLimit() {
        return questionLimit;
    }

    public void setQuestionLimit(
            int questionLimit
    ) {
        this.questionLimit =
                questionLimit;
    }
}
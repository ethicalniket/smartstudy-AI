package com.smartstudy.smartstudy_backend.dto;

public class QuizRequest {

    private String fileName;

    private String type;

    public String getFileName() {
        return fileName;
    }

    public void setFileName(
            String fileName
    ) {
        this.fileName = fileName;
    }

    public String getType() {
        return type;
    }

    public void setType(
            String type
    ) {
        this.type = type;
    }

}
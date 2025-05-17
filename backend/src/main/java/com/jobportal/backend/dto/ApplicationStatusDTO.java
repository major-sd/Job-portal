package com.jobportal.backend.dto;

import com.jobportal.backend.enums.ApplicationStatus;

public class ApplicationStatusDTO {
    private ApplicationStatus status;

    public ApplicationStatus getStatus() {
        return status;
    }

    public void setStatus(ApplicationStatus status) {
        this.status = status;
    }
} 
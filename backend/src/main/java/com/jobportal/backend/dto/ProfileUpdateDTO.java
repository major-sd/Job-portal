package com.jobportal.backend.dto;

import jakarta.validation.constraints.Size;

public class ProfileUpdateDTO {
    private String name;
    
    @Size(max = 1000, message = "Bio cannot exceed 1000 characters")
    private String bio;

    // Getters and Setters
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getBio() {
        return bio;
    }

    public void setBio(String bio) {
        this.bio = bio;
    }
} 
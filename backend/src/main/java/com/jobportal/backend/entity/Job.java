package com.jobportal.backend.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "jobs")
public class Job {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false, length = 1000)
    private String description;

    @ManyToOne
    @JoinColumn(name = "company_id", nullable = false)
    private User company;

    @Column(nullable = false)
    private String location;

    @Column(name = "salary_range")
    private String salaryRange;

    @Column(nullable = false)
    private LocalDateTime postedAt = LocalDateTime.now();

    @Column(nullable = false)
    private boolean isActive = true;
    
    @ElementCollection
    @CollectionTable(name = "job_requirements", joinColumns = @JoinColumn(name = "job_id"))
    @Column(name = "requirement", length = 500)
    private List<String> requirements = new ArrayList<>();
    
    @ElementCollection
    @CollectionTable(name = "job_responsibilities", joinColumns = @JoinColumn(name = "job_id"))
    @Column(name = "responsibility", length = 500)
    private List<String> responsibilities = new ArrayList<>();

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public User getCompany() {
        return company;
    }

    public void setCompany(User company) {
        this.company = company;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getSalaryRange() {
        return salaryRange;
    }

    public void setSalaryRange(String salaryRange) {
        this.salaryRange = salaryRange;
    }

    public LocalDateTime getPostedAt() {
        return postedAt;
    }

    public void setPostedAt(LocalDateTime postedAt) {
        this.postedAt = postedAt;
    }

    public boolean isActive() {
        return isActive;
    }

    public void setActive(boolean active) {
        isActive = active;
    }
    
    public List<String> getRequirements() {
        return requirements;
    }
    
    public void setRequirements(List<String> requirements) {
        this.requirements = requirements;
    }
    
    public List<String> getResponsibilities() {
        return responsibilities;
    }
    
    public void setResponsibilities(List<String> responsibilities) {
        this.responsibilities = responsibilities;
    }
}

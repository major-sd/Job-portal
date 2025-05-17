package com.jobportal.backend.controller;

import com.jobportal.backend.entity.Job;
import com.jobportal.backend.entity.Application;
import com.jobportal.backend.security.CustomUserDetails;
import com.jobportal.backend.service.JobService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/jobs")
public class JobController {

    @Autowired
    private JobService jobService;

    // Create a new job posting (COMPANY only)
    @PostMapping
    @PreAuthorize("hasRole('COMPANY')")
    public ResponseEntity<Job> createJob(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @Valid @RequestBody Job job) {
        Job createdJob = jobService.createJob(userDetails.getUser(), job);
        return ResponseEntity.ok(createdJob);
    }

    // Get all active jobs (Public)
    @GetMapping
    public ResponseEntity<List<Job>> getAllActiveJobs(
            @RequestParam(required = false) String location,
            @RequestParam(required = false) String title,
            @RequestParam(required = false) String salaryRange) {
        List<Job> jobs = jobService.searchJobs(location, title, salaryRange);
        return ResponseEntity.ok(jobs);
    }

    // Get job by ID (Public)
    @GetMapping("/{id}")
    public ResponseEntity<Job> getJobById(@PathVariable Long id) {
        return jobService.getJobById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Update job posting (COMPANY only, must be owner)
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('COMPANY')")
    public ResponseEntity<?> updateJob(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable Long id,
            @Valid @RequestBody Job job) {
        try {
            Job updatedJob = jobService.updateJob(userDetails.getUser().getId(), id, job);
            return ResponseEntity.ok(updatedJob);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Delete job posting (COMPANY only, must be owner)
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('COMPANY')")
    public ResponseEntity<?> deleteJob(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable Long id) {
        try {
            jobService.deleteJob(userDetails.getUser().getId(), id);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Get company's job postings (COMPANY only)
    @GetMapping("/company")
    @PreAuthorize("hasRole('COMPANY')")
    public ResponseEntity<List<Job>> getCompanyJobs(
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        List<Job> jobs = jobService.getJobsByCompany(userDetails.getUser().getId());
        return ResponseEntity.ok(jobs);
    }

    // Get applications for a job (COMPANY only, must be owner)
    @GetMapping("/{jobId}/applications")
    @PreAuthorize("hasRole('COMPANY')")
    public ResponseEntity<?> getJobApplications(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable Long jobId) {
        try {
            List<Application> applications = jobService.getJobApplications(userDetails.getUser().getId(), jobId);
            return ResponseEntity.ok(applications);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Update application status (COMPANY only, must be owner)
    @PutMapping("/applications/{applicationId}")
    @PreAuthorize("hasRole('COMPANY')")
    public ResponseEntity<?> updateApplicationStatus(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable Long applicationId,
            @RequestBody String status) {
        try {
            Application application = jobService.updateApplicationStatus(
                userDetails.getUser().getId(), applicationId, status);
            return ResponseEntity.ok(application);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
} 
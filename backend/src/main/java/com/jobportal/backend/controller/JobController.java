package com.jobportal.backend.controller;

import com.jobportal.backend.entity.Job;
import com.jobportal.backend.entity.Application;
import com.jobportal.backend.security.CustomUserDetails;
import com.jobportal.backend.service.JobService;
import com.jobportal.backend.dto.ApplicationStatusDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import jakarta.validation.Valid;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/jobs")
public class JobController {
    private static final Logger logger = LoggerFactory.getLogger(JobController.class);

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
    public ResponseEntity<List<Map<String, Object>>> getAllActiveJobs(
            @RequestParam(required = false) String location,
            @RequestParam(required = false) String title,
            @RequestParam(required = false) String salaryRange) {
        List<Job> jobs = jobService.searchJobs(location, title, salaryRange);
        List<Map<String, Object>> response = jobs.stream().map(job -> {
            // Format the date as ISO-8601 string (2023-05-01T00:00:00Z format)
            String formattedDate = null;
            if (job.getPostedAt() != null) {
                // Convert LocalDateTime to proper ISO-8601 format with Z suffix for UTC
                formattedDate = job.getPostedAt().toString().replace("T", "T").concat("Z");
            }
            
            return Map.of(
                "id", String.valueOf(job.getId()),
                "title", job.getTitle(),
                "company", Map.of("name", job.getCompany().getName()),
                "location", job.getLocation(),
                "salaryRange", job.getSalaryRange(),
                "description", job.getDescription(),
                "postedAt", formattedDate,
                "requirements", job.getRequirements(),
                "responsibilities", job.getResponsibilities(),
                "applicationsCount", jobService.getApplicationsCountForJob(job.getId())
            );
        }).toList();
        return ResponseEntity.ok(response);
    }

    // Get job by ID (Public)
    @GetMapping("/{id}")
    public ResponseEntity<?> getJobById(@PathVariable Long id) {
        return jobService.getJobById(id)
                .map(job -> {
                    // Format the date as ISO-8601 string
                    String formattedDate = null;
                    if (job.getPostedAt() != null) {
                        formattedDate = job.getPostedAt().toString().replace("T", "T").concat("Z");
                    }
                    
                    Map<String, Object> response = Map.of(
                        "id", String.valueOf(job.getId()),
                        "title", job.getTitle(),
                        "company", Map.of("name", job.getCompany().getName()),
                        "location", job.getLocation(),
                        "salaryRange", job.getSalaryRange(),
                        "description", job.getDescription(),
                        "postedAt", formattedDate,
                        "requirements", job.getRequirements(),
                        "responsibilities", job.getResponsibilities(),
                        "applicationsCount", jobService.getApplicationsCountForJob(job.getId())
                    );
                    
                    return ResponseEntity.ok(response);
                })
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
    public ResponseEntity<List<Map<String, Object>>> getCompanyJobs(
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        List<Job> jobs = jobService.getJobsByCompany(userDetails.getUser().getId());
        List<Map<String, Object>> response = jobs.stream().map(job -> Map.ofEntries(
            Map.entry("id", String.valueOf(job.getId())),
            Map.entry("title", job.getTitle()),
            Map.entry("company", Map.of("name", job.getCompany().getName())),
            Map.entry("location", job.getLocation()),
            Map.entry("salaryRange", job.getSalaryRange()),
            Map.entry("description", job.getDescription()),
            Map.entry("postedAt", job.getPostedAt() != null ? job.getPostedAt().toString().replace("T", "T").concat("Z") : null),
            Map.entry("requirements", job.getRequirements()),
            Map.entry("responsibilities", job.getResponsibilities()),
            Map.entry("applicationsCount", jobService.getApplicationsCountForJob(job.getId())),
            Map.entry("active", job.isActive())
        )).toList();
        return ResponseEntity.ok(response);
    }

    // Update job active status (COMPANY only, must be owner)
    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('COMPANY')")
    public ResponseEntity<?> updateJobStatus(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable Long id,
            @RequestParam boolean active) {
        logger.debug("Updating job status. JobId: {}, active: {}", id, active);
        try {
            Job updatedJob = jobService.updateJobActiveStatus(userDetails.getUser().getId(), id, active);
            return ResponseEntity.ok(updatedJob);
        } catch (RuntimeException e) {
            logger.error("Error updating job status: {}", e.getMessage());
            return ResponseEntity.badRequest().body(e.getMessage());
        }
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
            @Valid @RequestBody ApplicationStatusDTO statusDTO) {
        try {
            logger.info("Received status update request for application {}: {}", applicationId, statusDTO.getStatus());
            logger.info("Company ID from token: {}", userDetails.getUser().getId());
            
            Application application = jobService.updateApplicationStatus(
                userDetails.getUser().getId(), applicationId, statusDTO.getStatus());
            
            logger.info("Successfully updated application status");
            return ResponseEntity.ok(application);
        } catch (RuntimeException e) {
            logger.error("Error updating application status: {}", e.getMessage());
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
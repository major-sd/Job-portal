package com.jobportal.backend.controller;

import com.jobportal.backend.entity.User;
import com.jobportal.backend.entity.Job;
import com.jobportal.backend.entity.Application;
import com.jobportal.backend.security.CustomUserDetails;
import com.jobportal.backend.service.ApplicantService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

@RestController
@RequestMapping("/api/applicant")
@PreAuthorize("hasRole('APPLICANT')")  // Entire controller is applicant-only
public class ApplicantController {

    @Value("${app.upload.dir:${user.home}/uploads/resumes}")
    private String uploadDir;

    @Autowired
    private ApplicantService applicantService;

    // Get applicant profile
    @GetMapping("/profile")
    public ResponseEntity<User> getProfile(
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        return ResponseEntity.ok(userDetails.getUser());
    }

    // Update applicant profile
    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestBody User updatedUser) {
        try {
            User user = applicantService.updateProfile(userDetails.getUser().getId(), updatedUser);
            return ResponseEntity.ok(user);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Upload resume
    @PostMapping("/resume")
    public ResponseEntity<?> uploadResume(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestParam("file") MultipartFile file) {
        try {
            String resumeUrl = applicantService.uploadResume(userDetails.getUser().getId(), file);
            return ResponseEntity.ok(resumeUrl);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Get resume file
    @GetMapping("/resume/{userId}/{filename}")
    @PreAuthorize("hasAnyRole('COMPANY', 'ADMIN', 'APPLICANT')")
    public ResponseEntity<Resource> getResume(
            @PathVariable Long userId,
            @PathVariable String filename,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        try {
            // Security check - only allow access if:
            // 1. User is accessing their own resume
            // 2. User is a company viewing an application
            // 3. User is an admin
            if (!userDetails.getUser().getRole().toString().equals("ADMIN") &&
                !userDetails.getUser().getId().equals(userId) &&
                !userDetails.getUser().getRole().toString().equals("COMPANY")) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }

            Path filePath = Paths.get(uploadDir)
                    .resolve(userId.toString())
                    .resolve(filename)
                    .normalize();
            
            Resource resource = new UrlResource(filePath.toUri());
            
            if (!resource.exists()) {
                return ResponseEntity.notFound().build();
            }

            // Determine content type
            String contentType = determineContentType(filename);
            
            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType))
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"")
                    .body(resource);
        } catch (MalformedURLException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    private String determineContentType(String filename) {
        if (filename.toLowerCase().endsWith(".pdf")) {
            return "application/pdf";
        } else if (filename.toLowerCase().endsWith(".doc")) {
            return "application/msword";
        } else if (filename.toLowerCase().endsWith(".docx")) {
            return "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
        }
        return "application/octet-stream";
    }

    // Get all available jobs
    @GetMapping("/jobs")
    public ResponseEntity<List<Job>> getAllJobs(
            @RequestParam(required = false) String location,
            @RequestParam(required = false) String title,
            @RequestParam(required = false) String salaryRange) {
        List<Job> jobs = applicantService.searchJobs(location, title, salaryRange);
        return ResponseEntity.ok(jobs);
    }

    // Apply for a job
    @PostMapping("/apply/{jobId}")
    public ResponseEntity<?> applyToJob(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable Long jobId,
            @RequestParam(required = false) String resumeUrl) {
        try {
            Application application = applicantService.applyToJob(
                userDetails.getUser().getId(), jobId, resumeUrl);
            return ResponseEntity.ok(application);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Get my applications
    @GetMapping("/applications")
    public ResponseEntity<List<Application>> getMyApplications(
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        List<Application> applications = applicantService.getApplicationsByApplicant(
            userDetails.getUser().getId());
        return ResponseEntity.ok(applications);
    }

    // Get application status
    @GetMapping("/applications/{applicationId}")
    public ResponseEntity<?> getApplicationStatus(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable Long applicationId) {
        try {
            Application application = applicantService.getApplicationStatus(
                userDetails.getUser().getId(), applicationId);
            return ResponseEntity.ok(application);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Withdraw application
    @DeleteMapping("/applications/{applicationId}")
    public ResponseEntity<?> withdrawApplication(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable Long applicationId) {
        try {
            applicantService.withdrawApplication(userDetails.getUser().getId(), applicationId);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}

package com.jobportal.backend.service;

import com.jobportal.backend.entity.Application;
import com.jobportal.backend.entity.Job;
import com.jobportal.backend.entity.User;
import com.jobportal.backend.repository.ApplicationRepository;
import com.jobportal.backend.repository.JobRepository;
import com.jobportal.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.util.StringUtils;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.UUID;

@Service
public class ApplicantService {

    @Value("${app.upload.dir:${user.home}/uploads/resumes}")
    private String uploadDir;

    @Autowired
    private JobRepository jobRepository;

    @Autowired
    private ApplicationRepository applicationRepository;

    @Autowired
    private UserRepository userRepository;

    // Update applicant profile
    public User updateProfile(Long userId, User updatedUser) {
        User existingUser = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        existingUser.setName(updatedUser.getName());
        // Don't update email as it's used for authentication
        // Don't update role for security reasons
        // Add more fields as needed

        return userRepository.save(existingUser);
    }

    // Upload resume
    public String uploadResume(Long userId, MultipartFile file) {
        if (file.isEmpty()) {
            throw new RuntimeException("Failed to store empty file");
        }

        // Validate file type
        String contentType = file.getContentType();
        if (contentType == null || !isValidFileType(contentType)) {
            throw new RuntimeException("Invalid file type. Only PDF, DOC, and DOCX files are allowed");
        }

        // Generate unique filename
        String originalFilename = StringUtils.cleanPath(file.getOriginalFilename());
        String fileExtension = originalFilename.substring(originalFilename.lastIndexOf("."));
        String newFilename = UUID.randomUUID().toString() + fileExtension;

        try {
            // Create upload directory if it doesn't exist
            Path uploadPath = Paths.get(uploadDir + "/" + userId);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            // Save the file
            Path filePath = uploadPath.resolve(newFilename);
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            // Return the relative path that can be used to retrieve the file
            return "/api/applicant/resume/" + userId + "/" + newFilename;
        } catch (IOException e) {
            throw new RuntimeException("Failed to store file " + originalFilename, e);
        }
    }

    private boolean isValidFileType(String contentType) {
        return contentType.equals("application/pdf") ||
               contentType.equals("application/msword") ||
               contentType.equals("application/vnd.openxmlformats-officedocument.wordprocessingml.document");
    }

    // Search jobs with filters
    public List<Job> searchJobs(String location, String title, String salaryRange) {
        // For now, return all active jobs. You can implement more sophisticated search later
        return jobRepository.findByIsActiveTrue();
    }

    // Apply for a job
    @Transactional
    public Application applyToJob(Long applicantId, Long jobId, String resumeUrl) {
        if (resumeUrl == null || resumeUrl.trim().isEmpty()) {
            throw new RuntimeException("Resume is required to apply for a job");
        }

        User applicant = userRepository.findById(applicantId)
                .orElseThrow(() -> new RuntimeException("Applicant not found"));

        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new RuntimeException("Job not found"));

        // Check if already applied
        if (applicationRepository.findByApplicantAndJob(applicant, job).isPresent()) {
            throw new RuntimeException("You have already applied for this job");
        }

        Application application = new Application();
        application.setJob(job);
        application.setApplicant(applicant);
        application.setResumeUrl(resumeUrl);
        application.setStatus("PENDING");

        return applicationRepository.save(application);
    }

    // Get applicant's applications
    public List<Application> getApplicationsByApplicant(Long applicantId) {
        User applicant = userRepository.findById(applicantId)
                .orElseThrow(() -> new RuntimeException("Applicant not found"));
        return applicationRepository.findByApplicantOrderByAppliedAtDesc(applicant);
    }

    // Get application status
    public Application getApplicationStatus(Long applicantId, Long applicationId) {
        Application application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new RuntimeException("Application not found"));

        if (!application.getApplicant().getId().equals(applicantId)) {
            throw new RuntimeException("Not authorized to view this application");
        }

        return application;
    }

    // Withdraw application
    @Transactional
    public void withdrawApplication(Long applicantId, Long applicationId) {
        Application application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new RuntimeException("Application not found"));

        if (!application.getApplicant().getId().equals(applicantId)) {
            throw new RuntimeException("Not authorized to withdraw this application");
        }

        if (!"PENDING".equals(application.getStatus())) {
            throw new RuntimeException("Cannot withdraw application in " + application.getStatus() + " status");
        }

        applicationRepository.delete(application);
    }
}

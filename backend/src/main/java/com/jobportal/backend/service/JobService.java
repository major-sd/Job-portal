package com.jobportal.backend.service;

import com.jobportal.backend.entity.Job;
import com.jobportal.backend.entity.User;
import com.jobportal.backend.entity.Application;
import com.jobportal.backend.enums.ApplicationStatus;
import com.jobportal.backend.repository.JobRepository;
import com.jobportal.backend.repository.ApplicationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;
import java.util.Optional;

@Service
public class JobService {
    private static final Logger logger = LoggerFactory.getLogger(JobService.class);

    @Autowired
    private EmailService emailService;

    @Autowired
    private JobRepository jobRepository;

    @Autowired
    private ApplicationRepository applicationRepository;

    // Create a new job
    @Transactional
    public Job createJob(User company, Job job) {
        job.setCompany(company);
        job.setActive(true);
        return jobRepository.save(job);
    }

    // Search jobs with filters
    public List<Job> searchJobs(String location, String title, String salaryRange) {
        logger.info("Searching jobs with filters - title: {}, location: {}, salaryRange: {}",
                title, location, salaryRange);

        // Get jobs filtered by title, location, and salary range using a single query
        return jobRepository.searchJobs(
                title != null && !title.isEmpty() ? title : null,
                location != null && !location.isEmpty() ? location : null,
                salaryRange != null && !salaryRange.isEmpty() ? salaryRange : null
        );
    }

    // Get job by ID
    public Optional<Job> getJobById(Long id) {
        return jobRepository.findById(id);
    }

    // Update job
    @Transactional
    public Job updateJob(Long companyId, Long jobId, Job updatedJob) {
        Job existingJob = jobRepository.findById(jobId)
                .orElseThrow(() -> new RuntimeException("Job not found"));

        if (!existingJob.getCompany().getId().equals(companyId)) {
            throw new RuntimeException("Not authorized to update this job");
        }

        existingJob.setTitle(updatedJob.getTitle());
        existingJob.setDescription(updatedJob.getDescription());
        existingJob.setLocation(updatedJob.getLocation());
        existingJob.setSalaryRange(updatedJob.getSalaryRange());

        return jobRepository.save(existingJob);
    }

    // Delete job
    @Transactional
    public void deleteJob(Long companyId, Long jobId) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new RuntimeException("Job not found"));

        if (!job.getCompany().getId().equals(companyId)) {
            throw new RuntimeException("Not authorized to delete this job");
        }

        // Soft delete - just mark as inactive
        job.setActive(false);
        jobRepository.save(job);
    }

    // Get company's jobs
    public List<Job> getJobsByCompany(Long companyId) {
        return jobRepository.findByCompanyId(companyId);
    }

    // Get applications for a job
    public List<Application> getJobApplications(Long companyId, Long jobId) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new RuntimeException("Job not found"));

        if (!job.getCompany().getId().equals(companyId)) {
            throw new RuntimeException("Not authorized to view these applications");
        }

        return applicationRepository.findByJobId(jobId);
    }

    // Update job active status
    @Transactional
    public Job updateJobActiveStatus(Long companyId, Long jobId, boolean active) {
        logger.info("Attempting to update job {} active status to {} by company {}", jobId, active, companyId);

        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> {
                    logger.error("Job {} not found", jobId);
                    return new RuntimeException("Job not found");
                });

        if (!job.getCompany().getId().equals(companyId)) {
            logger.error("Company {} not authorized to update job {}", companyId, jobId);
            throw new RuntimeException("Not authorized to update this job");
        }

        job.setActive(active);
        Job savedJob = jobRepository.save(job);
        logger.info("Successfully updated job active status");

        return savedJob;
    }

    // Update application status
    @Transactional
    public Application updateApplicationStatus(Long companyId, Long applicationId, ApplicationStatus status) { // status is already ApplicationStatus enum
        logger.info("Attempting to update application {} status to {} by company {}", applicationId, status, companyId);

        Application application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> {
                    logger.error("Application {} not found", applicationId);
                    return new RuntimeException("Application not found");
                });

        // Validate company ownership
        // Ensure application.getJob() and application.getJob().getCompany() are not null before calling getId()
        if (application.getJob() == null || application.getJob().getCompany() == null) {
            logger.error("Application {} or its associated job/company is missing critical information.", applicationId);
            throw new RuntimeException("Application data is incomplete, cannot verify company ownership.");
        }
        Long jobCompanyId = application.getJob().getCompany().getId();
        logger.info("Found application. Job company ID: {}, Requesting company ID: {}", jobCompanyId, companyId);

        if (!jobCompanyId.equals(companyId)) {
            logger.error("Company {} not authorized to update application {}", companyId, applicationId);
            throw new RuntimeException("Not authorized to update this application");
        }

        // The 'status' parameter is already an ApplicationStatus enum, no need to parse from a string.
        // We assign it to newStatus to maintain the existing logic flow.
        ApplicationStatus newStatus = status;

        // Update status only if it's different
        if (application.getStatus() != newStatus) {
            logger.info("Updating application status from {} to {}", application.getStatus(), newStatus);
            application.setStatus(newStatus);
            Application savedApplication = applicationRepository.save(application);

            // Send email if status is REVIEWING, ACCEPTED, or REJECTED
            // The PENDING email is typically sent upon initial application creation.
            if (newStatus == ApplicationStatus.REVIEWING ||
                    newStatus == ApplicationStatus.ACCEPTED ||
                    newStatus == ApplicationStatus.REJECTED) {
                // Make sure emailService is not null
                if (emailService != null) {
                    emailService.sendApplicationStatusUpdateEmails(savedApplication);
                    logger.info("Notification email sent for application {}", applicationId);
                } else {
                    logger.warn("EmailService is null. Cannot send notification email for application {}", applicationId);
                }
            }

            return savedApplication;
        }

        logger.info("No status update needed. Status already {}", newStatus);
        return application;
    }
    public long getApplicationsCountForJob(Long jobId) {
        return applicationRepository.countByJobId(jobId);
    }
}

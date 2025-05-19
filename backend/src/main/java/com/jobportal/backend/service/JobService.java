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
    public Application updateApplicationStatus(Long companyId, Long applicationId, ApplicationStatus status) {
        logger.info("Attempting to update application {} status to {} by company {}", applicationId, status, companyId);
        
        Application application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> {
                    logger.error("Application {} not found", applicationId);
                    return new RuntimeException("Application not found");
                });

        logger.info("Found application. Job company ID: {}, Requesting company ID: {}", 
                   application.getJob().getCompany().getId(), companyId);

        if (!application.getJob().getCompany().getId().equals(companyId)) {
            logger.error("Company {} not authorized to update application {}", companyId, applicationId);
            throw new RuntimeException("Not authorized to update this application");
        }

        logger.info("Updating application status from {} to {}", application.getStatus(), status);
        application.setStatus(status);
        Application savedApplication = applicationRepository.save(application);
        logger.info("Successfully updated application status");
        
        return savedApplication;
    }

    public long getApplicationsCountForJob(Long jobId) {
        return applicationRepository.countByJobId(jobId);
    }
} 
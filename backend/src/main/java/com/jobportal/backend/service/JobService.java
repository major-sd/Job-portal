package com.jobportal.backend.service;

import com.jobportal.backend.entity.Job;
import com.jobportal.backend.entity.User;
import com.jobportal.backend.entity.Application;
import com.jobportal.backend.repository.JobRepository;
import com.jobportal.backend.repository.ApplicationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class JobService {

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
        // For now, return all active jobs. You can implement more sophisticated search later
        return jobRepository.findByIsActiveTrue();
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

    // Update application status
    @Transactional
    public Application updateApplicationStatus(Long companyId, Long applicationId, String status) {
        Application application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new RuntimeException("Application not found"));

        if (!application.getJob().getCompany().getId().equals(companyId)) {
            throw new RuntimeException("Not authorized to update this application");
        }

        application.setStatus(status);
        return applicationRepository.save(application);
    }
} 
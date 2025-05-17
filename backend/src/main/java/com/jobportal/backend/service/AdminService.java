package com.jobportal.backend.service;

import com.jobportal.backend.entity.User;
import com.jobportal.backend.enums.Role;
import com.jobportal.backend.entity.Job;
import com.jobportal.backend.entity.Application;
import com.jobportal.backend.enums.ApplicationStatus;
import com.jobportal.backend.repository.UserRepository;
import com.jobportal.backend.repository.JobRepository;
import com.jobportal.backend.repository.ApplicationRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.Map;
import java.util.ArrayList;
import java.time.LocalDateTime;

@Service
public class AdminService {
    private static final Logger logger = LoggerFactory.getLogger(AdminService.class);

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JobRepository jobRepository;

    @Autowired
    private ApplicationRepository applicationRepository;

    // User Management Methods
    public List<User> getAllUsers(String role, boolean includeInactive) {
        if (role != null) {
            Role roleEnum = Role.valueOf(role.toUpperCase());
            return userRepository.findByRole(roleEnum);
        }
        return userRepository.findAll();
    }

    public Optional<User> getUserById(Long id) {
        return userRepository.findById(id);
    }

    @Transactional
    public void deleteUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        // Delete associated data first
        if (user.getRole() == Role.COMPANY) {
            // Delete company's jobs and related applications
            List<Job> jobs = jobRepository.findByCompanyId(id);
            jobs.forEach(job -> {
                applicationRepository.deleteByJobId(job.getId());
            });
            jobRepository.deleteAll(jobs);
        } else if (user.getRole() == Role.APPLICANT) {
            // Delete applicant's applications
            applicationRepository.deleteByApplicantId(id);
        }
        
        userRepository.delete(user);
    }

    @Transactional
    public User updateUserStatus(Long id, boolean active) {
        logger.debug("Updating user status. UserId: {}, active: {}", id, active);
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        // Don't allow deactivating the last admin
        if (!active && user.getRole() == Role.ADMIN) {
            long adminCount = userRepository.countByRole(Role.ADMIN);
            if (adminCount <= 1) {
                throw new RuntimeException("Cannot deactivate the last admin user");
            }
        }
        
        user.setActive(active);
        return userRepository.save(user);
    }

    // Job Management Methods
    public List<Job> getAllJobs(Boolean active, boolean includeExpired) {
        if (active != null) {
            return jobRepository.findByIsActive(active);
        }
        return jobRepository.findAll();
    }

    @Transactional
    public Job updateJobStatus(Long id, boolean active) {
        Job job = jobRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Job not found"));
        jobRepository.updateJobActiveStatus(job.getId(), active);
        return jobRepository.findById(id).get();
    }

    @Transactional
    public void deleteJob(Long id) {
        Job job = jobRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Job not found"));
        // Delete all applications for this job first
        applicationRepository.deleteByJobId(id);
        jobRepository.delete(job);
    }

    // Application Management Methods
    public List<Application> getAllApplications(String status, boolean includeArchived) {
        if (status != null) {
            try {
                ApplicationStatus appStatus = ApplicationStatus.valueOf(status.toUpperCase());
                return applicationRepository.findByStatus(appStatus);
            } catch (IllegalArgumentException e) {
                throw new RuntimeException("Invalid application status: " + status);
            }
        }
        return applicationRepository.findAll();
    }

    @Transactional
    public Application updateApplicationStatus(Long id, String status) {
        Application application = applicationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Application not found"));
        try {
            ApplicationStatus appStatus = ApplicationStatus.valueOf(status.toUpperCase());
            application.setStatus(appStatus);
            return applicationRepository.save(application);
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Invalid application status: " + status);
        }
    }

    @Transactional
    public void deleteApplication(Long id) {
        applicationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Application not found"));
        applicationRepository.deleteById(id);
    }

    // Bulk Operations
    @Transactional
    public List<User> bulkUpdateUserStatus(Map<Long, Boolean> userStatusMap) {
        List<User> updatedUsers = new ArrayList<>();
        for (Map.Entry<Long, Boolean> entry : userStatusMap.entrySet()) {
            try {
                User updatedUser = updateUserStatus(entry.getKey(), entry.getValue());
                updatedUsers.add(updatedUser);
            } catch (RuntimeException e) {
                // Log error and continue with next user
                logger.error("Error updating user {}: {}", entry.getKey(), e.getMessage());
            }
        }
        return updatedUsers;
    }

    @Transactional
    public List<Job> bulkUpdateJobStatus(Map<Long, Boolean> jobStatusMap) {
        List<Job> updatedJobs = new ArrayList<>();
        for (Map.Entry<Long, Boolean> entry : jobStatusMap.entrySet()) {
            try {
                Job updatedJob = updateJobStatus(entry.getKey(), entry.getValue());
                updatedJobs.add(updatedJob);
            } catch (RuntimeException e) {
                // Log error and continue with next job
                logger.error("Error updating job {}: {}", entry.getKey(), e.getMessage());
            }
        }
        return updatedJobs;
    }
} 
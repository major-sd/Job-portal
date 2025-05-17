package com.jobportal.backend.service;

import com.jobportal.backend.entity.User;
import com.jobportal.backend.entity.Job;
import com.jobportal.backend.entity.Application;
import com.jobportal.backend.entity.Role;
import com.jobportal.backend.repository.UserRepository;
import com.jobportal.backend.repository.JobRepository;
import com.jobportal.backend.repository.ApplicationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class AdminService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JobRepository jobRepository;

    @Autowired
    private ApplicationRepository applicationRepository;

    // Get all users, optionally filtered by role
    public List<User> getAllUsers(String role) {
        if (role != null) {
            return userRepository.findByRole(Role.valueOf(role.toUpperCase()));
        }
        return userRepository.findAll();
    }

    // Get user by ID
    public Optional<User> getUserById(Long id) {
        return userRepository.findById(id);
    }

    // Delete user
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

    // Get all jobs
    public List<Job> getAllJobs(Boolean active) {
        if (active != null) {
            return jobRepository.findByIsActiveTrue();
        }
        return jobRepository.findAll();
    }

    // Get all applications
    public List<Application> getAllApplications(String status) {
        if (status != null) {
            return applicationRepository.findByStatus(status.toUpperCase());
        }
        return applicationRepository.findAll();
    }

    // Update user status
    @Transactional
    public User updateUserStatus(Long id, boolean active) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        // If deactivating a company, also deactivate their jobs
        if (!active && user.getRole() == Role.COMPANY) {
            List<Job> jobs = jobRepository.findByCompanyId(id);
            jobs.forEach(job -> job.setActive(false));
            jobRepository.saveAll(jobs);
        }
        
        // You might want to add an 'active' field to User entity
        // For now, we'll just return the user
        return user;
    }

    // Get system statistics
    public Map<String, Object> getSystemStats() {
        Map<String, Object> stats = new HashMap<>();
        
        // User statistics
        stats.put("totalUsers", userRepository.count());
        stats.put("totalCompanies", userRepository.countByRole(Role.COMPANY));
        stats.put("totalApplicants", userRepository.countByRole(Role.APPLICANT));
        
        // Job statistics
        stats.put("totalJobs", jobRepository.count());
        stats.put("activeJobs", jobRepository.countByIsActiveTrue());
        
        // Application statistics
        stats.put("totalApplications", applicationRepository.count());
        stats.put("pendingApplications", applicationRepository.countByStatus("PENDING"));
        stats.put("acceptedApplications", applicationRepository.countByStatus("ACCEPTED"));
        stats.put("rejectedApplications", applicationRepository.countByStatus("REJECTED"));
        
        return stats;
    }
} 
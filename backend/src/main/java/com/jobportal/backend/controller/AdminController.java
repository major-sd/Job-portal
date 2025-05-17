package com.jobportal.backend.controller;

import com.jobportal.backend.entity.User;
import com.jobportal.backend.entity.Job;
import com.jobportal.backend.entity.Application;
import com.jobportal.backend.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")  // Entire controller is admin-only
public class AdminController {

    @Autowired
    private AdminService adminService;

    // Get all users
    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers(
            @RequestParam(required = false) String role) {
        List<User> users = adminService.getAllUsers(role);
        return ResponseEntity.ok(users);
    }

    // Get user by ID
    @GetMapping("/users/{id}")
    public ResponseEntity<?> getUserById(@PathVariable Long id) {
        return adminService.getUserById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Delete user
    @DeleteMapping("/users/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        try {
            adminService.deleteUser(id);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Get all job postings
    @GetMapping("/jobs")
    public ResponseEntity<List<Job>> getAllJobs(
            @RequestParam(required = false) Boolean active) {
        List<Job> jobs = adminService.getAllJobs(active);
        return ResponseEntity.ok(jobs);
    }

    // Get all applications
    @GetMapping("/applications")
    public ResponseEntity<List<Application>> getAllApplications(
            @RequestParam(required = false) String status) {
        List<Application> applications = adminService.getAllApplications(status);
        return ResponseEntity.ok(applications);
    }

    // Update user status (e.g., activate/deactivate)
    @PutMapping("/users/{id}/status")
    public ResponseEntity<?> updateUserStatus(
            @PathVariable Long id,
            @RequestBody boolean active) {
        try {
            User user = adminService.updateUserStatus(id, active);
            return ResponseEntity.ok(user);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Get system statistics
    @GetMapping("/stats")
    public ResponseEntity<?> getSystemStats() {
        return ResponseEntity.ok(adminService.getSystemStats());
    }
} 
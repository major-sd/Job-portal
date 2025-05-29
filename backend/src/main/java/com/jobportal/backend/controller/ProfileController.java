package com.jobportal.backend.controller;

import com.jobportal.backend.dto.ProfileUpdateDTO;
import com.jobportal.backend.security.CustomUserDetails;
import com.jobportal.backend.service.ProfileService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/profiles")
public class ProfileController {

    @Autowired
    private ProfileService profileService;

    // Get current user's profile
    @GetMapping("/me")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Map<String, Object>> getMyProfile(
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        Map<String, Object> profile = profileService.getUserProfile(userDetails.getUser().getId());
        return ResponseEntity.ok(profile);
    }

    // Get any user's profile (public)
    @GetMapping("/{userId}")
    public ResponseEntity<Map<String, Object>> getUserProfile(@PathVariable Long userId) {
        Map<String, Object> profile = profileService.getUserProfile(userId);
        return ResponseEntity.ok(profile);
    }

    // Update current user's profile
    @PutMapping("/me")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Map<String, Object>> updateMyProfile(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @Valid @RequestBody ProfileUpdateDTO updateDTO) {
        Map<String, Object> updatedProfile = profileService.updateUserProfile(
                userDetails.getUser().getId(), updateDTO);
        return ResponseEntity.ok(updatedProfile);
    }

    // Admin can update any user's profile
    @PutMapping("/{userId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> updateUserProfile(
            @PathVariable Long userId,
            @Valid @RequestBody ProfileUpdateDTO updateDTO) {
        Map<String, Object> updatedProfile = profileService.updateUserProfile(userId, updateDTO);
        return ResponseEntity.ok(updatedProfile);
    }
} 
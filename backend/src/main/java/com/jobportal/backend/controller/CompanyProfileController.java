package com.jobportal.backend.controller;

import com.jobportal.backend.entity.CompanyProfile;
import com.jobportal.backend.entity.Role;
import com.jobportal.backend.security.CustomUserDetails;
import com.jobportal.backend.service.CompanyProfileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/company-profile")
public class CompanyProfileController {

    @Autowired
    private CompanyProfileService companyProfileService;

    // Create a company profile (COMPANY only)
    @PostMapping
    @PreAuthorize("hasRole('COMPANY')")
    public ResponseEntity<?> createCompanyProfile(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @Valid @RequestBody CompanyProfile profile) {
        
        if (userDetails.getUser().getRole() != Role.COMPANY) {
            return ResponseEntity.badRequest()
                .body("Only companies can create company profiles");
        }

        try {
            CompanyProfile savedProfile = companyProfileService.createCompanyProfile(
                userDetails.getUser().getId(), profile);
            return ResponseEntity.ok(savedProfile);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // GET /api/company-profile/me: Get own company profile (COMPANY only)
    @GetMapping("/me")
    @PreAuthorize("hasRole('COMPANY')")
    public ResponseEntity<?> getMyCompanyProfile(
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        
        return companyProfileService.getCompanyProfile(userDetails.getUser().getId())
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    // GET /api/company-profile/{userId}: Get any company's profile (Public)
    @GetMapping("/{userId}")
    public ResponseEntity<?> getCompanyProfileById(@PathVariable Long userId) {
        return companyProfileService.getCompanyProfile(userId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    
    // PUT /api/company-profile: Update own company profile (COMPANY only)
    @PutMapping
    @PreAuthorize("hasRole('COMPANY')")
    public ResponseEntity<?> updateCompanyProfile(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @Valid @RequestBody CompanyProfile profile) {
        
        try {
            CompanyProfile updatedProfile = companyProfileService.updateCompanyProfile(
                userDetails.getUser().getId(), profile);
            return ResponseEntity.ok(updatedProfile);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // DELETE /api/company-profile: Delete own company profile (COMPANY only)
    @DeleteMapping
    @PreAuthorize("hasRole('COMPANY')")
    public ResponseEntity<?> deleteCompanyProfile(
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        
        try {
            companyProfileService.deleteCompanyProfile(userDetails.getUser().getId());
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
} 
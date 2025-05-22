package com.jobportal.backend.service;

import com.jobportal.backend.entity.CompanyProfile;
import com.jobportal.backend.entity.User;
import com.jobportal.backend.repository.CompanyProfileRepository;
import com.jobportal.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
public class CompanyProfileService {

    @Autowired
    private CompanyProfileRepository companyProfileRepository;

    @Autowired
    private UserRepository userRepository;

    @Transactional
    public CompanyProfile createCompanyProfile(Long userId, CompanyProfile profile) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        profile.setUser(user);
        CompanyProfile savedProfile = companyProfileRepository.save(profile);
        user.setCompanyProfile(savedProfile);
        userRepository.save(user);
        
        return savedProfile;
    }

    public CompanyProfile updateCompanyProfile(Long userId, CompanyProfile updatedProfile) {
        CompanyProfile existingProfile = companyProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Company profile not found"));

        existingProfile.setCompanyName(updatedProfile.getCompanyName());
        existingProfile.setBio(updatedProfile.getBio());
        
        return companyProfileRepository.save(existingProfile);
    }

    public Optional<CompanyProfile> getCompanyProfile(Long userId) {
        return companyProfileRepository.findByUserId(userId);
    }

    @Transactional
    public void deleteCompanyProfile(Long userId) {
        CompanyProfile profile = companyProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Company profile not found"));
        
        User user = profile.getUser();
        user.setCompanyProfile(null);
        userRepository.save(user);
        
        companyProfileRepository.delete(profile);
    }
}
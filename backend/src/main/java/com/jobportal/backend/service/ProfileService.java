package com.jobportal.backend.service;

import com.jobportal.backend.dto.ProfileUpdateDTO;
import com.jobportal.backend.entity.User;
import com.jobportal.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.Map;

@Service
public class ProfileService {

    @Autowired
    private UserRepository userRepository;

    @Transactional(readOnly = true)
    public Map<String, Object> getUserProfile(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Map<String, Object> profile = new HashMap<>();
        profile.put("id", user.getId());
        profile.put("name", user.getName());
        profile.put("email", user.getEmail());
        profile.put("role", user.getRole());
        profile.put("bio", user.getBio());
        profile.put("createdAt", user.getCreatedAt());

        return profile;
    }

    @Transactional
    public Map<String, Object> updateUserProfile(Long userId, ProfileUpdateDTO updateDTO) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Update fields if they are not null
        if (updateDTO.getName() != null) {
            user.setName(updateDTO.getName());
        }
        if (updateDTO.getBio() != null) {
            user.setBio(updateDTO.getBio());
        }

        user = userRepository.save(user);

        Map<String, Object> updatedProfile = new HashMap<>();
        updatedProfile.put("id", user.getId());
        updatedProfile.put("name", user.getName());
        updatedProfile.put("email", user.getEmail());
        updatedProfile.put("role", user.getRole());
        updatedProfile.put("bio", user.getBio());
        updatedProfile.put("createdAt", user.getCreatedAt());

        return updatedProfile;
    }
} 
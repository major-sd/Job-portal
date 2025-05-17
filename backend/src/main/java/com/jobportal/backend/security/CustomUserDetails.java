package com.jobportal.backend.security;

import com.jobportal.backend.entity.User;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.Collections;

public class CustomUserDetails implements UserDetails {

    private static final Logger logger = LoggerFactory.getLogger(CustomUserDetails.class);
    private final User user;

    public CustomUserDetails(User user) {
        this.user = user;
        logger.debug("Creating CustomUserDetails for user: {}", user.getEmail());
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        // Convert Enum to ROLE_ format
        String roleName = "ROLE_" + user.getRole().name();  // e.g., ROLE_APPLICANT
        logger.debug("Converting role {} to authority: {}", user.getRole().name(), roleName);
        SimpleGrantedAuthority authority = new SimpleGrantedAuthority(roleName);
        logger.debug("Created authority: {}", authority);
        return Collections.singletonList(authority);
    }

    @Override
    public String getPassword() {
        return user.getPassword();
    }

    @Override
    public String getUsername() {
        return user.getEmail();
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return user.isActive();  // Use the active status from the user entity
    }

    // Get the underlying user entity
    public User getUser() {
        return user;
    }

    @Override
    public String toString() {
        return "CustomUserDetails{" +
                "email='" + getUsername() + '\'' +
                ", role='" + user.getRole() + '\'' +
                ", authorities=" + getAuthorities() +
                '}';
    }
}

package com.jobportal.backend.controller;

import com.jobportal.backend.dto.AuthResponse;
import com.jobportal.backend.dto.LoginRequest;
import com.jobportal.backend.dto.RegisterRequest;
import com.jobportal.backend.entity.User;
import com.jobportal.backend.repository.UserRepository;
import com.jobportal.backend.security.jwt.JwtUtils;
import com.jobportal.backend.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired private UserRepository userRepo;
    @Autowired private PasswordEncoder passwordEncoder;
    @Autowired private JwtUtils jwtUtils;
    @Autowired private EmailService emailService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@Validated @RequestBody RegisterRequest req) {
        if (userRepo.findByEmail(req.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body("Email is already in use");
        }
        User user = new User(
                req.getName(),
                req.getEmail(),
                passwordEncoder.encode(req.getPassword()),
                req.getRole()
        );
        userRepo.save(user);
        emailService.sendRegistrationEmail(user.getEmail(), user.getName());
        return ResponseEntity.ok(Collections.singletonMap("message", "User registered successfully"));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Validated @RequestBody LoginRequest req) {
        Optional<User> userOpt = userRepo.findByEmail(req.getEmail());
        if (userOpt.isEmpty() ||
                !passwordEncoder.matches(req.getPassword(), userOpt.get().getPassword())) {
            return ResponseEntity
                    .status(401)
                    .body(Collections.singletonMap("error", "Invalid email or password"));
        }
        User user = userOpt.get();
        String token = jwtUtils.generateToken(user.getEmail(), user.getId(), user.getRole());
        return ResponseEntity.ok(Collections.unmodifiableMap(
            Map.of(
                "token", token,
                "user", Map.of(
                    "name", user.getName(),
                    "role", user.getRole(),
                            "id",user.getId(),
                            "bio", user.getBio() == null ? "" : user.getBio()
                )
            )
        ));
    }
}

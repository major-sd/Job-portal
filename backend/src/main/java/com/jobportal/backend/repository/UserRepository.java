package com.jobportal.backend.repository;
import com.jobportal.backend.entity.User;
import com.jobportal.backend.enums.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    List<User> findByRole(Role role);
    long countByRole(Role role);
    boolean existsByEmail(String email);

    @Modifying
    @Query("UPDATE User u SET u.active = :active WHERE u.id = :userId")
    void updateUserActiveStatus(Long userId, boolean active);
}
package com.jobportal.backend.repository;

import com.jobportal.backend.entity.Job;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JobRepository extends JpaRepository<Job, Long> {
    List<Job> findByIsActiveTrue();
    List<Job> findByCompanyId(Long companyId);
    long countByIsActiveTrue();
    List<Job> findByIsActive(Boolean isActive);

    @Modifying
    @Query("UPDATE Job j SET j.isActive = :active WHERE j.id = :jobId")
    void updateJobActiveStatus(Long jobId, boolean active);
}

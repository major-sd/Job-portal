package com.jobportal.backend.repository;

import com.jobportal.backend.entity.Job;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JobRepository extends JpaRepository<Job, Long> {
    List<Job> findByIsActiveTrue();
    List<Job> findByCompanyId(Long companyId);
    long countByIsActiveTrue();
}

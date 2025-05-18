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
    
    // Search by title (case-insensitive partial match)
    List<Job> findByTitleContainingIgnoreCaseAndIsActiveTrue(String title);
    
    // Search by location (case-insensitive partial match)
    List<Job> findByLocationContainingIgnoreCaseAndIsActiveTrue(String location);
    
    // Search by salary range (case-insensitive partial match)
    // Use exact matching for salary range since it might contain special characters
    List<Job> findBySalaryRangeAndIsActiveTrue(String salaryRange);
    
    // Custom query for advanced search with dynamic parameters
    @Query("SELECT j FROM Job j WHERE j.isActive = true " +
           "AND (:title IS NULL OR LOWER(j.title) LIKE LOWER(CONCAT('%', :title, '%'))) " +
           "AND (:location IS NULL OR LOWER(j.location) LIKE LOWER(CONCAT('%', :location, '%'))) " +
           "AND (:salaryRange IS NULL OR j.salaryRange = :salaryRange)")
    List<Job> searchJobs(String title, String location, String salaryRange);
}

package com.jobportal.backend.repository;

import com.jobportal.backend.entity.Application;
import com.jobportal.backend.entity.User;
import com.jobportal.backend.entity.Job;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ApplicationRepository extends JpaRepository<Application, Long> {
    List<Application> findByApplicantOrderByAppliedAtDesc(User applicant);
    List<Application> findByJobId(Long jobId);
    List<Application> findByStatus(String status);
    void deleteByJobId(Long jobId);
    void deleteByApplicantId(Long applicantId);
    long countByStatus(String status);
    Optional<Application> findByApplicantAndJob(User applicant, Job job);
}

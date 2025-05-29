package com.jobportal.backend.service;

import com.jobportal.backend.entity.Application;
import com.jobportal.backend.enums.ApplicationStatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private final JavaMailSender emailSender;

    @Value("${spring.mail.from:noreply@yourjobportal.com}")
    private String fromEmailAddress;

    @Autowired
    public EmailService(JavaMailSender emailSender) {
        this.emailSender = emailSender;
    }

    public void sendRegistrationEmail(String toEmail, String userName) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject("Welcome to JobPortal – Let’s Get Started!");

        message.setText(
                "Hi " + userName + ",\n\n" +
                        "Welcome to JobPortal!\n\n" +
                        "You’ve successfully registered and we’re excited to have you on board.\n\n" +
                        "Whether you're here to discover great job opportunities or to find top talent for your organization, you're in the right place.\n\n" +
                        "Our platform connects ambitious professionals with companies that value talent.\n\n" +
                        "If you have any questions or need support, feel free to reach out anytime.\n\n" +
                        "Wishing you a successful journey ahead!\n\n" +
                        "Warm regards,\n" +
                        "The JobPortal Team"
        );
        emailSender.send(message);
    }

    public void sendApplicationStatusUpdateEmails(Application application) {
        ApplicationStatus status = application.getStatus();
        String applicantEmail = application.getApplicant().getEmail();
        String jobTitle = application.getJob().getTitle();
        String applicantName = application.getApplicant().getName();

        String companyEmail = null;
        if (application.getJob() != null && application.getJob().getCompany() != null) {
            companyEmail = application.getJob().getCompany().getEmail();
        }

        String applicantSubject = "";
        String applicantBody = "";
        String companySubject = "";
        String companyBody = "";
        boolean sendToCompany = false;

        switch (status) {
            case PENDING:
                applicantSubject = "Application Received: " + jobTitle;
                applicantBody = "Dear " + applicantName + ",\n\n" +
                        "Thank you for applying for the position of " + jobTitle + ". " +
                        "Your application has been successfully submitted and is now PENDING review.\n\n" +
                        "We will keep you updated on the progress.\n\n" +
                        "Sincerely,\nThe Hiring Team";

                if (companyEmail != null) {
                    companySubject = "New Application Received: " + jobTitle;
                    companyBody = "Dear Hiring Team,\n\n" +
                            "A new application has been submitted for the position of " + jobTitle +
                            " by " + applicantName + " (" + applicantEmail + ").\n\n" +
                            "Please review the application in the portal.\n\n" +
                            "Regards,\nJob Portal System";
                    sendToCompany = true;
                }
                break;

            case REVIEWING:
                applicantSubject = "Application Update: " + jobTitle + " is Under Review";
                applicantBody = "Dear " + applicantName + ",\n\n" +
                        "Your application for the position of " + jobTitle + " is currently REVIEWING.\n\n" +
                        "We appreciate your patience and will inform you of the outcome.\n\n" +
                        "Sincerely,\nThe Hiring Team";
                break;

            case ACCEPTED:
                applicantSubject = "Congratulations! Your Application for " + jobTitle + " is Accepted";
                applicantBody = "Dear " + applicantName + ",\n\n" +
                        "We are pleased to inform you that your application for the position of " + jobTitle +
                        " has been ACCEPTED! We will be in touch shortly with the next steps.\n\n" +
                        "Sincerely,\nThe Hiring Team";
                break;

            case REJECTED:
                applicantSubject = "Application Update: " + jobTitle;
                applicantBody = "Dear " + applicantName + ",\n\n" +
                        "Thank you for your interest in the position of " + jobTitle + ". " +
                        "After careful consideration, we have decided to move forward with other candidates for this role. Your application status is now REJECTED.\n\n" +
                        "We wish you the best in your job search.\n\n" +
                        "Sincerely,\nThe Hiring Team";
                break;

            default:
                System.err.println("Unhandled application status for email: " + status);
                return;
        }

        if (applicantEmail != null && !applicantSubject.isEmpty()) {
            sendEmail(applicantEmail, applicantSubject, applicantBody);
        }

        if (sendToCompany && companyEmail != null && !companySubject.isEmpty()) {
            sendEmail(companyEmail, companySubject, companyBody);
        }
    }

    private void sendEmail(String to, String subject, String text) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromEmailAddress);
        message.setTo(to);
        message.setSubject(subject);
        message.setText(text);
        try {
            emailSender.send(message);
            System.out.println("Email sent successfully to " + to + " with subject: " + subject);
        } catch (MailException e) {
            System.err.println("Error sending email to " + to + ": " + e.getMessage());
        }
    }
}
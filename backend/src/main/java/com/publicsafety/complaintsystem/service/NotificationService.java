package com.publicsafety.complaintsystem.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
public class NotificationService {

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @Autowired
    private JavaMailSender mailSender;

    @Async
    public void notifyAdmin(String messageContent) {
        // 1. Send WebSocket message to admin dashboard
        messagingTemplate.convertAndSend("/topic/admin/complaints", messageContent);

        // 2. Send Email Notification
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo("admin@publicsafety.com"); // Real implementation would query Admin users
            message.setSubject("New Public Safety Complaint Submitted");
            message.setText(messageContent);
            mailSender.send(message);
        } catch (Exception e) {
            // Ignore email exceptions for local dev if SMTP is not configured
            System.err.println("Email failed: " + e.getMessage());
        }
    }
}

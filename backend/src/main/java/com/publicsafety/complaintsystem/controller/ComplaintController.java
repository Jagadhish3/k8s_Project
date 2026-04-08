package com.publicsafety.complaintsystem.controller;

import com.publicsafety.complaintsystem.domain.Complaint;
import com.publicsafety.complaintsystem.domain.User;
import com.publicsafety.complaintsystem.repository.UserRepository;
import com.publicsafety.complaintsystem.security.JwtUtil;
import com.publicsafety.complaintsystem.service.ComplaintService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/complaints")
public class ComplaintController {

    @Autowired
    private ComplaintService complaintService;

    @Autowired
    private UserRepository userRepository;

    // Public endpoint for anonymous submissions
    @PostMapping("/public")
    public ResponseEntity<Complaint> submitAnonymousComplaint(@RequestBody Complaint complaint) {
        complaint.setAnonymous(true);
        complaint.setUser(null);
        return ResponseEntity.ok(complaintService.submitComplaint(complaint));
    }

    // Authenticated endpoints
    @PostMapping
    public ResponseEntity<Complaint> submitComplaint(@RequestBody Complaint complaint) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Optional<User> userOp = userRepository.findByEmail(auth.getName());
        
        if (userOp.isPresent()) {
            complaint.setUser(userOp.get());
            complaint.setAnonymous(false);
            return ResponseEntity.ok(complaintService.submitComplaint(complaint));
        }
        return ResponseEntity.badRequest().build();
    }

    @GetMapping
    public ResponseEntity<List<Complaint>> getMyComplaints() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Optional<User> userOp = userRepository.findByEmail(auth.getName());
        
        if (userOp.isPresent()) {
            return ResponseEntity.ok(complaintService.getComplaintsByUser(userOp.get().getId()));
        }
        return ResponseEntity.badRequest().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Complaint> getComplaint(@PathVariable Long id) {
        return complaintService.getComplaintById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}

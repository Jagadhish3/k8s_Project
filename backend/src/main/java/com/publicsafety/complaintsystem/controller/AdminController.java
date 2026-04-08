package com.publicsafety.complaintsystem.controller;

import com.publicsafety.complaintsystem.domain.Complaint;
import com.publicsafety.complaintsystem.domain.Status;
import com.publicsafety.complaintsystem.service.ComplaintService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private ComplaintService complaintService;

    @GetMapping("/complaints")
    public ResponseEntity<List<Complaint>> getAllComplaints() {
        return ResponseEntity.ok(complaintService.getAllComplaints());
    }

    @PutMapping("/complaints/{id}/status")
    public ResponseEntity<Complaint> updateComplaintStatus(@PathVariable Long id, @RequestParam Status status) {
        return ResponseEntity.ok(complaintService.updateComplaintStatus(id, status));
    }
}

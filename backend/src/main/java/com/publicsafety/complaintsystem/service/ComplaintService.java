package com.publicsafety.complaintsystem.service;

import com.publicsafety.complaintsystem.domain.Complaint;
import com.publicsafety.complaintsystem.repository.ComplaintRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class ComplaintService {

    @Autowired
    private ComplaintRepository complaintRepository;

    @Autowired
    private NotificationService notificationService;

    @Transactional
    public Complaint submitComplaint(Complaint complaint) {
        Complaint savedComplaint = complaintRepository.save(complaint);
        
        // Trigger real-time alert to admins
        notificationService.notifyAdmin("New Complaint [" + savedComplaint.getCategory() + "]: " + savedComplaint.getTitle());
        
        return savedComplaint;
    }

    public List<Complaint> getComplaintsByUser(Long userId) {
        return complaintRepository.findByUserIdOrderByTimestampDesc(userId);
    }

    public List<Complaint> getAllComplaints() {
        return complaintRepository.findAllByOrderByTimestampDesc();
    }

    public Optional<Complaint> getComplaintById(Long id) {
        return complaintRepository.findById(id);
    }

    @Transactional
    public Complaint updateComplaintStatus(Long id, com.publicsafety.complaintsystem.domain.Status status) {
        Optional<Complaint> complaintOp = complaintRepository.findById(id);
        if (complaintOp.isPresent()) {
            Complaint complaint = complaintOp.get();
            complaint.setStatus(status);
            return complaintRepository.save(complaint);
        }
        throw new RuntimeException("Complaint not found");
    }
}

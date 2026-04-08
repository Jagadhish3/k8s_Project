package com.publicsafety.complaintsystem.repository;

import com.publicsafety.complaintsystem.domain.Complaint;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ComplaintRepository extends JpaRepository<Complaint, Long> {
    List<Complaint> findByUserIdOrderByTimestampDesc(Long userId);
    List<Complaint> findAllByOrderByTimestampDesc();
}

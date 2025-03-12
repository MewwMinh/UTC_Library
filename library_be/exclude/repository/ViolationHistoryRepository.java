package edu.utc.demo_01.repository;

import edu.utc.demo_01.dto.staff.librarian.response.ViolationResponse;
import edu.utc.demo_01.dto.staff.support_staff.reponse.UserResponse;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ViolationHistoryRepository extends JpaRepository<ViolationHistory, String> {
    @Query(value = """
        SELECT v.ViolationID AS violationID,
               u1.FullName AS userName,
               u2.FullName AS staffName,
               v.ViolationType AS violationType,
               v.Description AS description,
               v.PenaltyAmount AS penaltyAmount,
               v.ViolationDate AS violationDate    
        FROM ViolationHistory v
        JOIN Users u1 ON v.UserID = u1.UserId
        JOIN Users u2 ON v.RecordedBy = u2.UserId    
    """, nativeQuery = true)
    List<ViolationResponse> getAllViolations();
    @Query(value = """
        SELECT v.ViolationID AS violationID,
               u1.FullName AS userName,
               u2.FullName AS staffName,
               v.ViolationType AS violationType,
               v.Description AS description,
               v.PenaltyAmount AS penaltyAmount,
               v.ViolationDate AS violationDate    
        FROM ViolationHistory v
        JOIN Users u1 ON v.UserID = u1.UserId
        JOIN Users u2 ON v.RecordedBy = u2.UserId
        WHERE v.UserID = :userID    
    """, nativeQuery = true)
    List<ViolationResponse> getAllViolationsByUserID(@Param("userID") String userID);
}
package edu.utc.demo_01.repository;

import edu.utc.demo_01.dto.patron.response.ViolationsResponse;
import edu.utc.demo_01.entity.User;
import edu.utc.demo_01.entity.UserViolation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface UserViolationRepository extends JpaRepository<UserViolation, String> {
    int countByUserID(User userID);
    @Query(value = """
    SELECT FullName AS staffName, 
               ViolationType AS violationType,
               Description AS description,
               PointsDeducted AS pointsDeducted,
               PenaltyAmount AS penaltyAmount,
               ViolationDate AS violationDate
        FROM UserViolation v
        JOIN Users u ON u.UserID=v.RecordedBy
        WHERE v.userID = :id 
        ORDER BY ViolationDate DESC 
""", nativeQuery = true)
    List<ViolationsResponse> getUserViolations(@Param("id") String id);
}
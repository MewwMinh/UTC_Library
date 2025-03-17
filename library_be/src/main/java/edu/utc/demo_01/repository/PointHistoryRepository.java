package edu.utc.demo_01.repository;

import edu.utc.demo_01.dto.patron.response.PointHistoryResponse;
import edu.utc.demo_01.entity.PointHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface PointHistoryRepository extends JpaRepository<PointHistory, String> {
    @Query(value = """
        SELECT Points AS points,
               Reason AS reason,
               FullName AS updatedBy,
               ph.CreatedAt AS createdAt    
        FROM PointHistory ph
         LEFT JOIN Users u ON u.UserID = ph.UpdatedBy  
        WHERE ph.UserID = :userID
        ORDER BY ph.CreatedAt DESC
    """, nativeQuery = true)
    List<PointHistoryResponse> getPatronPointHistory(@Param("userID") String userID);
}
package edu.utc.demo_01.repository;

import edu.utc.demo_01.dto.staff.catalog_manager.response.BookResponse;
import edu.utc.demo_01.dto.staff.support_staff.reponse.UserRequestDetailResponse;
import edu.utc.demo_01.dto.staff.support_staff.reponse.UserRequestResponse;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface SupportRequestRepository extends JpaRepository<SupportRequest, String> {
    @Query(value = """
        SELECT sr.RequestID AS requestID, 
               u.FullName AS username, 
               sr.Category AS problem, 
               sr.Status AS status, 
               sr.CreatedAt AS createAt 
        FROM SupportRequests sr
        JOIN Users u ON sr.UserID = u.UserID   
    """, nativeQuery = true)
    List<UserRequestResponse> findAllRequests();
    @Query(value = """
        SELECT sr.RequestID AS requestID, 
               u.FullName AS username, 
               sr.Category AS problem,
               sr.Description AS description,
               sr.Status AS status, 
               sr.CreatedAt AS createAt 
        FROM SupportRequests sr
        JOIN Users u ON sr.UserID = u.UserID
        WHERE sr.RequestID = :id   
    """, nativeQuery = true)
    UserRequestDetailResponse findByRequestID(@Param("id") String id);
}
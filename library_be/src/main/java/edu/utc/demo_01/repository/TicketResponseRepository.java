package edu.utc.demo_01.repository;

import edu.utc.demo_01.dto.patron.response.RespondDTO;
import edu.utc.demo_01.entity.TicketResponse;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface TicketResponseRepository extends JpaRepository<TicketResponse, String> {
    @Query(value = """
        SELECT FullName AS staffName,
               Title AS title,
               ResponseText AS description,
               tr.CreatedAt AS createAt
        FROM TicketResponses tr
        JOIN Users u ON tr.StaffID = u.UserID   
        WHERE TicketID = :ticketID
    """, nativeQuery = true)
    List<RespondDTO> findByTicketID(@Param("ticketID") String ticketID);
}
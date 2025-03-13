package edu.utc.demo_01.repository;

import edu.utc.demo_01.dto.patron.response.RequestDetailDTO;
import edu.utc.demo_01.entity.HelpTicket;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface HelpTicketRepository extends JpaRepository<HelpTicket, String> {
    Optional<HelpTicket> findByTicketID(String ticketID);
    @Query(value = """
        SELECT TicketID AS ticketID,
               Problem AS problem,
               Title AS title,
               Description AS description,
               Status AS status,
               CreatedAt AS createAt
        FROM HelpTickets
        WHERE UserID = :userID
        ORDER BY CreatedAt DESC   
    """, nativeQuery = true)
    List<RequestDetailDTO> findByUserID(@Param("userID") String userID);
    @Query(value = """
        SELECT TicketID AS ticketID,
               Problem AS problem,
               Title AS title,
               Description AS description,
               Status AS status,
               CreatedAt AS createAt
        FROM HelpTickets
        WHERE TicketID = :ticketID
    """, nativeQuery = true)
    RequestDetailDTO findTicketDetailByTicketID(@Param("ticketID") String ticketID);
}
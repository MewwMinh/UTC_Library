package edu.utc.demo_01.repository;

import edu.utc.demo_01.dto.librarian.response.HelpTicketResponse;
import edu.utc.demo_01.dto.librarian.response.HelpTicketResponseDetails;
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

    @Query(value = """
        SELECT COUNT(*)
        FROM HelpTickets
    """, nativeQuery = true)
    int countHelpTicket();

    int countByStatus(String status);

    @Query(value = """
        SELECT TicketID AS ticketID,
               FullName AS patronName,    
               Problem AS problem,
               h.Title AS title,
               h.Status AS status,
               h.CreatedAt AS createAt,
               h.Description AS description
        FROM HelpTickets h
        JOIN Users u ON u.UserID = h.UserID  
        ORDER BY h.CreatedAt DESC   
    """, nativeQuery = true)
    List<HelpTicketResponse> getAllHelpTickets();
    @Query(value = """
        SELECT TicketID AS ticketID,
               FullName AS patronName,    
               Problem AS problem,
               Title AS title,
               h.Status AS status,
               h.CreatedAt AS createAt,
               h.Description AS description,
               u.UserImage AS userImage,
               u.UserID AS userID,
               m.MembershipType AS membershipType,    
               a.Email AS email,
               u.MemberPoints AS memberPoints    
        FROM HelpTickets h
        JOIN Users u ON u.UserID = h.UserID
        JOIN AuthCredentials a ON u.UserID = a.UserID
        JOIN Memberships m ON u.UserID = m.UserID    
        WHERE TicketID = :ticketID
    """, nativeQuery = true)
    HelpTicketResponseDetails getHelpTicketDetail(@Param("ticketID") String ticketID);
}
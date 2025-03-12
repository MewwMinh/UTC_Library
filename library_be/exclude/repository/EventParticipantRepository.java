package edu.utc.demo_01.repository;

import edu.utc.demo_01.dto.staff.librarian.response.EventParticipantReponse;
import edu.utc.demo_01.dto.user.reponse.BookDetailsResponse;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface EventParticipantRepository extends JpaRepository<EventParticipant, String> {
    EventParticipant findByEventParticipantID(String eventParticipantID);
    @Query(value = """
        SELECT ep.EventParticipantID AS eventParticipantID,
               u.FullName AS userName,
               m.MembershipType AS membershipTier,
               ep.AttendanceStatus AS attendanceStatus 
        FROM EventParticipants ep 
        JOIN Events e ON e.eventID = ep.eventID 
        JOIN Users u ON ep.userID = u.userID
        JOIN Memberships m ON u.userID = m.userID   
        WHERE ep.eventID = :id
    """, nativeQuery = true)
    List<EventParticipantReponse> getEventParticipantByEventID(@Param("id") String id);
}
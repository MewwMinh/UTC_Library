package edu.utc.demo_01.repository;

import edu.utc.demo_01.dto.patron.response.EventResponse1;
import edu.utc.demo_01.entity.Event;
import edu.utc.demo_01.entity.EventParticipant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface EventParticipantRepository extends JpaRepository<EventParticipant, String> {
    @Query(value = """
        SELECT *
        FROM EventParticipants ep 
        WHERE UserID = :userID
        AND EventID = :eventID
        AND AttendanceStatus = 'Đã đăng ký'   
    """, nativeQuery = true)
    EventParticipant findRegistedByUserIDAndEventID(String userID, String eventID);
    @Query(value = """
        SELECT e.EventID AS eventID,
               Title AS title,
               Description AS description,
               StartTime AS startTime,
               EndTime AS endTime,
               Location AS location,
               AttendanceStatus AS status
        FROM EventParticipants ep 
        JOIN Events e ON ep.EventID = e.EventID
        WHERE ep.UserID = :id
        ORDER BY StartTime DESC   
    """, nativeQuery = true)
    List<EventResponse1> getAllAttendedEvents(@Param("id") String id);
    @Query(value = """
        SELECT COUNT(*)
        FROM EventParticipants
        WHERE EventID = :id
        AND AttendanceStatus = 'Đã đăng ký'   
    """, nativeQuery = true)
    int countParticipants(@Param("id") String id);
    @Query(value = """
        SELECT EXISTS (
        SELECT 1 FROM EventParticipants
        WHERE EventID = :eventID
        AND UserID = :userID
        AND AttendanceStatus = 'Đã đăng ký'
        )             
    """, nativeQuery = true)
    int isRegisted(@Param("userID") String userID, @Param("eventID") String eventID);

    List<EventParticipant> findByEventID(Event eventID);
}
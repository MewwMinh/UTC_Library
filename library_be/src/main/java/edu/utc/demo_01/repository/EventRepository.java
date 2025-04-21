package edu.utc.demo_01.repository;

import edu.utc.demo_01.dto.patron.response.EventResponse;
import edu.utc.demo_01.entity.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface EventRepository extends JpaRepository<Event, String> {
    Optional<Event> findByEventID(String eventID);
    @Query(value = """
        SELECT EventID AS eventID,
               Title AS title,
               Description AS description,
               StartTime AS startTime,
               EndTime AS endTime,
               Location AS location
        FROM Events
        ORDER BY StartTime DESC   
    """, nativeQuery = true)
    List<EventResponse> getAllEvents();
    @Query(value = """
        SELECT
            e.EventID AS eventID,
            e.Title AS title,
            e.Description AS description,
            e.StartTime AS startTime,
            e.EndTime AS endTime,
            e.Location AS location,
            e.MaxAttendees AS maxAttendees,
            COUNT(CASE 
                WHEN ep.AttendanceStatus = 'Đã đăng ký' THEN 1 
            END) AS registeredParticipantCount,
            COUNT(CASE 
                WHEN ep.AttendanceStatus = 'Đã tham gia' THEN 1 
            END) AS eventAttendeeCount  
        FROM
            Events e 
        LEFT JOIN
            EventParticipants ep 
                ON e.EventID = ep.EventID  
        GROUP BY
            e.EventID,
            e.Title,
            e.Description,
            e.StartTime,
            e.EndTime,
            e.Location,
            e.MaxAttendees
        ORDER BY StartTime DESC   
    """, nativeQuery = true)
    List<edu.utc.demo_01.dto.coordinator.response.EventResponse> getEvents();
    @Query(value = """
        SELECT
            e.EventID AS eventID,
            e.Title AS title,
            e.Description AS description,
            e.StartTime AS startTime,
            e.EndTime AS endTime,
            e.Location AS location,
            e.MaxAttendees AS maxAttendees,
            COUNT(CASE 
                WHEN ep.AttendanceStatus = 'Đã đăng ký' THEN 1 
            END) AS registeredParticipantCount,
            COUNT(CASE 
                WHEN ep.AttendanceStatus = 'Đã tham gia' THEN 1 
            END) AS eventAttendeeCount  
        FROM
            Events e 
        LEFT JOIN
            EventParticipants ep 
                ON e.EventID = ep.EventID
        WHERE e.EventID = :eventID   
        GROUP BY
            e.EventID,
            e.Title,
            e.Description,
            e.StartTime,
            e.EndTime,
            e.Location,
            e.MaxAttendees;  
    """, nativeQuery = true)
    edu.utc.demo_01.dto.coordinator.response.EventResponse getEventByEventID(@Param("eventID") String eventID);
}
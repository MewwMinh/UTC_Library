package edu.utc.demo_01.repository;

import edu.utc.demo_01.dto.patron.response.EventResponse;
import edu.utc.demo_01.entity.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

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
               Location AS location,
               Status AS status
        FROM Events
        ORDER BY StartTime DESC   
    """, nativeQuery = true)
    List<EventResponse> getAllEvents();
}
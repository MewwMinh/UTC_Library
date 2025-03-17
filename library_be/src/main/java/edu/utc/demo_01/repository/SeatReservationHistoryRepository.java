package edu.utc.demo_01.repository;

import edu.utc.demo_01.dto.patron.response.SeatReservationResponse;
import edu.utc.demo_01.entity.SeatReservationHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface SeatReservationHistoryRepository extends JpaRepository<SeatReservationHistory, String> {
    SeatReservationHistory findByReservationID(String reservationID);
    @Query(value = """
        SELECT ReservationID AS reservationID,
               SeatType AS seatType,
               ReservationTime AS reservationTime,
               s.Status AS status,
               Reason AS reason,
               st.FullName AS acceptBy
        FROM SeatReservationHistory s 
        LEFT JOIN Users st ON s.AcceptBy = st.UserID
        JOIN Users u ON s.UserID = u.UserID
        WHERE s.UserID=:userID
        ORDER BY ExpirationTime DESC   
    """, nativeQuery = true)
    List<SeatReservationResponse> findAllByUserID(@Param("userID") String userID);
}
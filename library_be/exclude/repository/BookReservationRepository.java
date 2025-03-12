package edu.utc.demo_01.repository;

import edu.utc.demo_01.dto.user.reponse.BookReservationResponse;
import edu.utc.demo_01.dto.user.reponse.BookReviewResponse;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface BookReservationRepository extends JpaRepository<BookReservation, String> {
    Optional<BookReservation> findByReservationID(String reservationID);
    @Query(value = """
        SELECT b.Title AS bookName,  
               br.ReservationID AS reservationID, 
               br.ReservationDate AS reservationDate,
               br.ExpiryDate AS expiryDate, 
               br.Status AS status    
        FROM BookReservations br
        JOIN Books b ON br.bookID = b.bookID
        WHERE br.userID = :userID
        ORDER BY br.ReservationDate DESC
    """, nativeQuery = true)
    List<BookReservationResponse> getAllBookReservationByUserID(@Param("userID") String userID);
}
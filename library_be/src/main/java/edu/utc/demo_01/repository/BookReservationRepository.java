package edu.utc.demo_01.repository;

import edu.utc.demo_01.dto.patron.response.BookReservationResponse;
import edu.utc.demo_01.entity.Book;
import edu.utc.demo_01.entity.BookReservation;
import edu.utc.demo_01.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface BookReservationRepository extends JpaRepository<BookReservation, String> {
    BookReservation findByReservationID(String reservationID);
    boolean existsByUserIDAndBookID(User user, Book book);
    @Query(value = """
        SELECT ReservationID AS reservationID,
               BookName AS bookName,
               ReservationDate AS reservationDate,
               ExpiryDate AS expirationDate,
               PickupDate AS pickupDate,
               Status AS status
        FROM BookReservations br 
        JOIN Books b ON br.BookID=b.BookID
        WHERE br.UserID=:userID
        ORDER BY ReservationDate DESC   
    """, nativeQuery = true)
    List<BookReservationResponse> findAllByUserID(@Param("userID") String userID);
}
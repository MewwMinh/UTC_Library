package edu.utc.demo_01.repository;

import edu.utc.demo_01.entity.Book;
import edu.utc.demo_01.entity.BookReservation;
import edu.utc.demo_01.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BookReservationRepository extends JpaRepository<BookReservation, String> {
    boolean existsByUserIDAndBookID(User user, Book book);
}
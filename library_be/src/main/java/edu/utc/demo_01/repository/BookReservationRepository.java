package edu.utc.demo_01.repository;

import edu.utc.demo_01.entity.BookReservation;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BookReservationRepository extends JpaRepository<BookReservation, String> {
}
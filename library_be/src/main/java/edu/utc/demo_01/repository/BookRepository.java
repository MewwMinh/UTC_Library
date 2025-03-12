package edu.utc.demo_01.repository;

import edu.utc.demo_01.entity.Book;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;


public interface BookRepository extends JpaRepository<Book, String> {
    Optional<Book> findByBookID(String bookID);
}
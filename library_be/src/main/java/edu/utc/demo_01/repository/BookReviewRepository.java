package edu.utc.demo_01.repository;

import edu.utc.demo_01.entity.Book;
import edu.utc.demo_01.entity.BookReview;
import edu.utc.demo_01.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BookReviewRepository extends JpaRepository<BookReview, String> {
    int countBookReviewsByUserID(User userID);
    boolean existsByBookIDAndUserID(Book bookID, User userID);
}
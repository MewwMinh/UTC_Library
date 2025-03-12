package edu.utc.demo_01.repository;

import edu.utc.demo_01.dto.user.reponse.BookReviewResponse;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface BookReviewRepository extends JpaRepository<BookReview, String> {
    boolean existsByBookIDAndUserID(Book book, User user);
    @Query(value = """
        SELECT u.fullName AS fullName, 
               br.rating AS rating, 
               br.comment AS comment, 
               br.createdAt AS createdAt
        FROM BookReviews br
        JOIN Users u ON br.userID = u.userID
        WHERE br.bookID = :bookID
        ORDER BY br.createdAt DESC
    """, nativeQuery = true)
    List<BookReviewResponse> findReviewsByBookId(@Param("bookID") String bookID);
    void deleteByReviewID(String reviewID);
}
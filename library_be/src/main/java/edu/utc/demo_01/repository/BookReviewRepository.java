package edu.utc.demo_01.repository;

import edu.utc.demo_01.dto.patron.response.BookReviewResponse;
import edu.utc.demo_01.entity.Book;
import edu.utc.demo_01.entity.BookReview;
import edu.utc.demo_01.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface BookReviewRepository extends JpaRepository<BookReview, String> {
    int countBookReviewsByUserID(User userID);
    boolean existsByBookIDAndUserID(Book bookID, User userID);
    Optional<BookReview> findByReviewID(String reviewID);
    @Query(value = """
        SELECT br.ReviewID AS reviewID,
                u.fullName AS fullName,
                    u.UserImage AS userImage,
               br.rating AS rating, 
               br.comment AS comment, 
               br.createdAt AS createdAt
        FROM BookReviews br
        JOIN Users u ON br.userID = u.userID
        WHERE br.bookID = :bookID
        ORDER BY br.createdAt DESC
    """, nativeQuery = true)
    List<BookReviewResponse> findReviewsByBookId(@Param("bookID") String bookID);
}
package edu.utc.demo_01.repository;

import edu.utc.demo_01.dto.patron.response.BookDetailResponse;
import edu.utc.demo_01.entity.Book;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;


public interface BookRepository extends JpaRepository<Book, String> {
    Optional<Book> findByBookID(String bookID);
    @Query(value = """
        SELECT b.BookName AS bookName,
                       b.Author AS author,
                       b.BookType AS bookType,
                       b.ISBN AS isbn,
                       b.TotalCopies AS totalCopies,
                       b.AvailableCopies AS availableCopies,
                       b.PublicationYear AS publicationYear,
                       b.Language AS language,
                       b.PageCount AS pages,
                       b.Format AS format,
                       b.Description AS description,
                       b.CoverImage AS coverImage,
                       d.DDCName AS ddcName
                FROM Books b
                JOIN DDCClassification d ON b.DDCCode = d.DDCCode
        		WHERE b.BookID = :bookID
    """, nativeQuery = true)
    Optional<BookDetailResponse> getBookDetailByBookID(@Param("bookID") String bookID);
}
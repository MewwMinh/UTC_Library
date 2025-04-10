package edu.utc.demo_01.repository;

import edu.utc.demo_01.dto.librarian.response.BookResponse;
import edu.utc.demo_01.dto.patron.response.BookBriefResponse;
import edu.utc.demo_01.dto.patron.response.BookDetailResponse;
import edu.utc.demo_01.entity.Book;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface BookRepository extends JpaRepository < Book,
        String > {
    Optional < Book > findByBookID(String bookID);
    Optional<Book> findByIsbn(String isbn);
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
    Optional < BookDetailResponse > getBookDetailByBookID(@Param("bookID") String bookID);@Query(value = """
        SELECT BookID AS bookID,
               BookName AS bookName,
               Author AS bookAuthor,
               AvailableCopies AS availableCopies,
               d.DDCName AS ddcName,
               CoverImage AS bookImage    
        FROM Books b
        JOIN DDCClassification d ON b.DDCCode = d.DDCCode
        WHERE b.DDCCode = :ddcCode
        ORDER BY RAND()
        LIMIT 8;                               
    """, nativeQuery = true)
    List < BookBriefResponse > getBookByDDCCode(@Param("ddcCode") String ddcCode);@Query(value = """
        SELECT b.BookID AS bookID,
               BookName AS bookName,
               Author AS bookAuthor,
               AvailableCopies AS availableCopies,
               d.DDCName AS ddcName,
               CoverImage AS bookImage
        FROM Books b
        JOIN BorrowRecords br ON b.BookID = br.BookID        
        JOIN DDCClassification d ON b.DDCCode = d.DDCCode
        GROUP BY b.BookID, b.BookName    
        ORDER BY COUNT(*) DESC           
        LIMIT 8;                               
    """, nativeQuery = true)
    List < BookBriefResponse > getSuggestionBooks();@Query(value = """
        SELECT b.BookID AS bookID,
               BookName AS bookName,
               Author AS bookAuthor,
               AvailableCopies AS availableCopies,
               d.DDCName AS ddcName,
               CoverImage AS bookImage
        FROM Books b
        JOIN DDCClassification d ON b.DDCCode = d.DDCCode
        WHERE LOWER(b.BookName) LIKE LOWER(CONCAT('%', :keyword, '%'))
            OR LOWER(b.Author) LIKE LOWER(CONCAT('%', :keyword, '%'))
        GROUP BY b.bookID
    """, nativeQuery = true)
    List < BookBriefResponse > findBookByTitleOrAuthor(@Param("keyword") String keyword);

    boolean existsByIsbn(String isbn);

    @Query(value = """
        SELECT
            b.BookID AS bookID,
            BookName AS bookName,
            Author AS author,
            BookType AS bookType,
            ISBN AS isbn,
            TotalCopies AS totalCopies,
            AvailableCopies AS availableCopies,
            PublicationYear AS publicationYear,
            Language AS language,
            PageCount AS pageCount,
            Format AS format,
            b.Description AS description,
            CoverImage AS coverImage,
            DDCName AS ddcName,
            Price AS price    
        FROM
            Books b         
        JOIN
            DDCClassification d 
                ON b.DDCCode = d.DDCCode
    """, nativeQuery = true)
    List <BookResponse> getAllBooks();
}
package edu.utc.demo_01.repository;

import edu.utc.demo_01.dto.admin.response.QuantityOfBook;
import edu.utc.demo_01.dto.staff.catalog_manager.response.BookResponse;
import edu.utc.demo_01.dto.user.reponse.BookDetailsResponse;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BookRepository extends JpaRepository<Book, String> {
    Optional<Book> findByBookID(String bookID);
    @Query(value = """
        SELECT b.title AS title, 
               b.author AS author, 
               b.isbn AS isbn, 
               b.totalCopies AS totalCopies, 
               b.availableCopies AS availableCopies, 
               GROUP_CONCAT(c.categoryName) AS category 
        FROM Books b 
        LEFT JOIN BookCategories bc ON b.bookID = bc.bookID 
        LEFT JOIN Categories c ON bc.categoryID = c.categoryID 
        GROUP BY b.bookID
    """, nativeQuery = true)
    List<BookResponse> findAllBooks();

    @Query(value = """
        SELECT
            b.bookID,    
            b.title,
            b.author,
            b.availableCopies,
            GROUP_CONCAT(c.categoryName) AS category
        FROM Books b
        LEFT JOIN BookCategories bc ON b.bookID = bc.bookID
        LEFT JOIN Categories c ON bc.categoryID = c.categoryID
        WHERE LOWER(b.title) LIKE LOWER(CONCAT('%', :keyword, '%'))
            OR LOWER(b.author) LIKE LOWER(CONCAT('%', :keyword, '%'))
        GROUP BY b.bookID
    """, nativeQuery = true)
    List<edu.utc.demo_01.dto.user.reponse.BookResponse> findBookByTitleOrAuthor(@Param("keyword") String keyword);

    @Query(value = """
        SELECT b.title AS title, 
               b.author AS author, 
               b.availableCopies AS availableCopies, 
               GROUP_CONCAT(c.categoryName) AS category 
        FROM Books b 
        LEFT JOIN BookCategories bc ON b.bookID = bc.bookID 
        LEFT JOIN Categories c ON bc.categoryID = c.categoryID 
        WHERE b.bookID = :bookID
        GROUP BY b.bookID
    """, nativeQuery = true)
    BookDetailsResponse bookDetails(@Param("bookID") String bookID);
    @Query(value = """
        SELECT COUNT(*) AS TotalBooks,
                     SUM(TotalCopies) AS TotalBookCopies,
                     SUM(AvailableCopies) AS TotalAvailableBooks 
        FROM Books
    """, nativeQuery = true)
    QuantityOfBook bookQuantity();
}
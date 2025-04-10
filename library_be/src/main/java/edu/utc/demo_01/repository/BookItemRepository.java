package edu.utc.demo_01.repository;

import edu.utc.demo_01.entity.Book;
import edu.utc.demo_01.entity.BookItem;
import jakarta.validation.constraints.NotNull;
import org.springframework.data.domain.Limit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface BookItemRepository extends JpaRepository<BookItem, String> {
    List<BookItem> findByBookIDAndStatus(Book bookID, String status);
    Long countByBookIDAndStatus(Book bookID, String status);

    Optional<BookItem> findByItemID(String itemID);
    @Query(value = """
        SELECT COUNT(*)        
        FROM BookItems      
        WHERE ItemID = :itemID
        AND Status = 'Có sẵn'       
        """, nativeQuery = true)
    int existsByItemIDAndAvaiable(@Param("itemID") String itemID);
    @Query(value = """
        SELECT MAX(CAST(SUBSTRING_INDEX(Barcode, '-', -1) AS UNSIGNED))
        FROM BookItems
        WHERE BookID = :bookID       
        """, nativeQuery = true)
    int getMaxBarcode(@Param("bookID") String bookID);

    BookItem findByBookID(@NotNull Book bookID, Limit limit);

    List<BookItem> findByBookID(@NotNull Book bookID);
}
package edu.utc.demo_01.repository;

import edu.utc.demo_01.dto.patron.response.BorrowBookResponse;
import edu.utc.demo_01.dto.patron.response.BorrowBookResponse1;
import edu.utc.demo_01.dto.patron.response.TopBookResponse;
import edu.utc.demo_01.entity.BorrowRecord;
import edu.utc.demo_01.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface BorrowRecordRepository extends JpaRepository<BorrowRecord, String> {
    Optional<BorrowRecord> findByRecordID(String recordID);

    int countByUserID(User userID);
    @Query(value = """
        SELECT br.RecordID 
        FROM BorrowRecords br
        WHERE br.userID = :userID
        AND br.bookID = :bookID
        AND br.ReturnDate IS NULL                   
        ORDER BY br.DueDate ASC
        LIMIT 1                        
    """, nativeQuery = true)
    Optional<String> findBorrowRecordIDByBookIDAndUserID(@Param("bookID") String bookID, @Param("userID") String userID);
    @Query(value = """
        SELECT b.BookName AS bookName, 
               br.BorrowDate AS borrowDate,
               br.DueDate AS dueDate,
               br.ReturnDate AS returnDate
        FROM BorrowRecords br
        JOIN Books b ON br.bookID = b.bookID
        WHERE br.userID = :id
        ORDER BY br.BorrowDate DESC 
        LIMIT 5
    """, nativeQuery = true)
    List<BorrowBookResponse> get5RecentBorrowBooks(@Param("id") String id);
    @Query(value = """
        SELECT COUNT(*)
        FROM BorrowRecords
        WHERE ReturnDate IS NULL
        AND DueDate <= DATE_ADD(CURDATE(), INTERVAL 7 DAY)
        AND UserID = :id   
    """, nativeQuery = true)
    int countNearDueDateByUserID(@Param("id") String id);
    @Query(value = """
    SELECT b.BookID AS bookID, 
           bk.BookName AS bookName, 
           COUNT(*) AS borrowedTimesCount
    FROM BorrowRecords b
    JOIN Books bk ON b.BookID = bk.BookID
    GROUP BY b.BookID, bk.BookName
    ORDER BY borrowedTimesCount DESC
    LIMIT 10
""", nativeQuery = true)
    List<TopBookResponse> findTop10BorrowedBooks();
    @Query(value = """
    SELECT b.BookID AS bookID,
        b.BookName AS bookName, 
               br.BorrowDate AS borrowDate,
               br.DueDate AS dueDate,
               br.ReturnDate AS returnDate,
               b.CoverImage AS bookImage
        FROM BorrowRecords br
        JOIN Books b ON br.bookID = b.bookID
        WHERE br.userID = :id
        AND br.ReturnDate IS NULL
        ORDER BY br.BorrowDate DESC
""", nativeQuery = true)
    List<BorrowBookResponse1> findBorrowingBooks(@Param("id") String id);
    @Query(value = """
    SELECT b.BookID AS bookID,
        b.BookName AS bookName, 
               br.BorrowDate AS borrowDate,
               br.DueDate AS dueDate,
               br.ReturnDate AS returnDate,
               b.CoverImage AS bookImage
        FROM BorrowRecords br
        JOIN Books b ON br.bookID = b.bookID
        WHERE br.userID = :id
        AND DueDate < DATE_ADD(CURDATE(), INTERVAL 7 DAY)  
        AND br.ReturnDate IS NULL
        ORDER BY br.DueDate ASC 
""", nativeQuery = true)
    List<BorrowBookResponse1> getNearAndOverDueBooks(@Param("id") String id);
    @Query(value = """
    SELECT b.BookID AS bookID,
        b.BookName AS bookName, 
               br.BorrowDate AS borrowDate,
               br.DueDate AS dueDate,
               br.ReturnDate AS returnDate,
               b.CoverImage AS bookImage
        FROM BorrowRecords br
        JOIN Books b ON br.bookID = b.bookID
        WHERE br.userID = :id 
        AND br.ReturnDate IS NOT NULL
        ORDER BY br.BorrowDate DESC 
""", nativeQuery = true)
    List<BorrowBookResponse1> getBorrowRecordsHistory(@Param("id") String id);
}

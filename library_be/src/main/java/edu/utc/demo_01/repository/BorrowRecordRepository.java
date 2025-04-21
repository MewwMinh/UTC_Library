package edu.utc.demo_01.repository;

import edu.utc.demo_01.dto.librarian.response.BorrowReturnWeekly;
import edu.utc.demo_01.dto.patron.response.BorrowBookResponse1;
import edu.utc.demo_01.dto.patron.response.BorrowBookResponse2;
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
        SELECT b.BookID AS bookID,
        b.BookName AS bookName, 
               br.BorrowDate AS borrowDate,
               br.DueDate AS dueDate,
               br.ReturnDate AS returnDate,
               b.CoverImage AS bookImage
        FROM BorrowRecords br
        JOIN Books b ON br.bookID = b.bookID
        WHERE br.userID = :id
        ORDER BY br.BorrowDate DESC 
        LIMIT 5
    """, nativeQuery = true)
    List<BorrowBookResponse1> get5RecentBorrowBooks(@Param("id") String id);
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
           COUNT(*) AS borrowedTimesCount,
           bk.CoverImage AS bookImage
    FROM BorrowRecords b
    JOIN Books bk ON b.BookID = bk.BookID
    GROUP BY b.BookID, bk.BookName
    ORDER BY borrowedTimesCount DESC
    LIMIT 10
""", nativeQuery = true)
    List<TopBookResponse> findTop10BorrowedBooks();
    @Query(value = """
    SELECT br.RecordID AS borrowRecordID,
        b.BookID AS bookID,
        b.BookName AS bookName, 
               br.BorrowDate AS borrowDate,
               br.DueDate AS dueDate,
               br.ReturnDate AS returnDate,
               b.CoverImage AS bookImage,
               b.Author AS author
        FROM BorrowRecords br
        JOIN Books b ON br.bookID = b.bookID
        WHERE br.userID = :id
        AND br.ReturnDate IS NULL
        ORDER BY br.BorrowDate DESC
""", nativeQuery = true)
    List<BorrowBookResponse2> findBorrowingBooks(@Param("id") String id);
    @Query(value = """
    SELECT br.RecordID AS borrowRecordID,
        b.BookID AS bookID,
        b.BookName AS bookName, 
               br.BorrowDate AS borrowDate,
               br.DueDate AS dueDate,
               br.ReturnDate AS returnDate,
               b.CoverImage AS bookImage,
               b.Author AS author
        FROM BorrowRecords br
        JOIN Books b ON br.bookID = b.bookID
        WHERE br.userID = :id
        AND DueDate < DATE_ADD(CURDATE(), INTERVAL 7 DAY)  
        AND br.ReturnDate IS NULL
        ORDER BY br.DueDate ASC 
""", nativeQuery = true)
    List<BorrowBookResponse2> getNearAndOverDueBooks(@Param("id") String id);
    @Query(value = """
    SELECT br.RecordID AS borrowRecordID,
        b.BookID AS bookID,
        b.BookName AS bookName, 
               br.BorrowDate AS borrowDate,
               br.DueDate AS dueDate,
               br.ReturnDate AS returnDate,
               b.CoverImage AS bookImage,
               b.Author AS author
        FROM BorrowRecords br
        JOIN Books b ON br.bookID = b.bookID
        WHERE br.userID = :id 
        AND br.ReturnDate IS NOT NULL
        ORDER BY br.BorrowDate DESC 
""", nativeQuery = true)
    List<BorrowBookResponse2> getBorrowRecordsHistory(@Param("id") String id);
    @Query(value = """
    WITH DateSeries AS (
        SELECT CURDATE() - INTERVAL n DAY AS Date
        FROM (
            SELECT 0 AS n UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 
            UNION ALL SELECT 4 UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7
        ) AS Numbers
    )
    SELECT 
        ds.Date AS date,
        COALESCE(SUM(b.BorrowedBooks), 0) AS borrowedBooks,
        COALESCE(SUM(b.ReturnedBooks), 0) AS returnedBooks
    FROM DateSeries ds
    LEFT JOIN (
        -- Lấy số lượng sách mượn theo ngày
        SELECT DATE(BorrowDate) AS Date, COUNT(*) AS BorrowedBooks, 0 AS ReturnedBooks
        FROM BorrowRecords
        WHERE BorrowDate >= DATE_SUB(CURDATE(), INTERVAL 6 DAY)
        GROUP BY Date
    
        UNION ALL
    
        -- Lấy số lượng sách trả theo ngày
        SELECT DATE(ReturnDate) AS Date, 0 AS BorrowedBooks, COUNT(*) AS ReturnedBooks
        FROM BorrowRecords
        WHERE ReturnDate IS NOT NULL AND ReturnDate >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
        GROUP BY Date
    ) b ON ds.Date = b.Date
    GROUP BY ds.Date
    ORDER BY ds.Date DESC; 
""", nativeQuery = true)
    List<BorrowReturnWeekly> getWeeklyBorrowReturn();
    @Query(value = """
    SELECT COUNT(*)
        FROM BorrowRecords br
        JOIN Books b ON br.bookID = b.bookID
        WHERE br.userID = :id
        AND b.BookType = :bookType 
        AND br.ReturnDate IS NULL
""", nativeQuery = true)
    int getBorrowedCountByUserIDAndBookType(@Param("id") String id, @Param("bookType") String bookType);
    @Query(value = """
    SELECT br.RecordID AS borrowRecordID,
        b.BookID AS bookID,
        b.BookName AS bookName, 
               br.BorrowDate AS borrowDate,
               br.DueDate AS dueDate,
               br.ReturnDate AS returnDate,
               b.CoverImage AS bookImage,
               b.Author AS author
        FROM BorrowRecords br
        JOIN Books b ON br.bookID = b.bookID
        WHERE br.userID = :id 
        ORDER BY br.BorrowDate DESC 
""", nativeQuery = true)
    List<BorrowBookResponse2> getPatronBorrowRecordsHistory(@Param("id") String id);
}

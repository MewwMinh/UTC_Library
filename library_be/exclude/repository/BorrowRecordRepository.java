package edu.utc.demo_01.repository;

import edu.utc.demo_01.dto.admin.response.QuantityOfOverDueBook;
import edu.utc.demo_01.dto.user.reponse.BookDetailsResponse;
import edu.utc.demo_01.dto.user.reponse.BorrowBookResponse;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface BorrowRecordRepository extends JpaRepository<BorrowRecord, String> {
    BorrowRecord findByRecordID(String recordID);
    @Query(value = """
        SELECT b.title AS bookName, 
               br.BorrowDate AS borrowDate, 
               br.DueDate AS dueDate, 
               br.ReturnDate AS returnDate
        FROM BorrowRecords br
        JOIN Books b ON br.bookID = b.bookID
        WHERE br.userID = :id    
    """, nativeQuery = true)
    List<BorrowBookResponse> getBorrowRecordsByUserID(@Param("id") String id);
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
        SELECT COUNT(*) AS totalRecords
        FROM BorrowRecords
        WHERE userID = :id
        AND ReturnDate IS NULL    
    """, nativeQuery = true)
    Integer getNumberOfBookBorrowedByUserID(@Param("id") String id);
    @Query(value = """
        SELECT b.title AS bookName, 
               br.BorrowDate AS borrowDate, 
               br.DueDate AS dueDate, 
               br.ReturnDate AS returnDate
        FROM BorrowRecords br
        JOIN Books b ON br.bookID = b.bookID
        WHERE br.userID = :id
        AND br.ReturnDate IS NULL
        AND br.DueDate < CURRENT_DATE    
    """, nativeQuery = true)
    List<BorrowBookResponse> getOverDueBookByUserID(@Param("id") String id);
    @Query(value = """
        SELECT SUM(CASE WHEN DueDate < CURRENT_DATE AND BorrowDate >= DATE_SUB(CURRENT_DATE, INTERVAL 7 DAY) THEN 1 ELSE 0 END) AS OverdueLastWeek,
                   SUM(CASE WHEN DueDate < CURRENT_DATE AND BorrowDate >= DATE_SUB(CURRENT_DATE, INTERVAL 1 MONTH) THEN 1 ELSE 0 END) AS OverdueLastMonth,
                   SUM(CASE WHEN DueDate < CURRENT_DATE AND BorrowDate >= DATE_SUB(CURRENT_DATE, INTERVAL 3 MONTH) THEN 1 ELSE 0 END) AS OverdueLast3Months
        FROM BorrowRecords  
    """, nativeQuery = true)
    QuantityOfOverDueBook getQuantityOfOverDueBookByTime();
}
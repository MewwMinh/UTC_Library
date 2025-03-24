package edu.utc.demo_01.repository;

import edu.utc.demo_01.dto.librarian.response.PatronRecentActivity;
import edu.utc.demo_01.entity.RecentTransaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface RecentTransactionRepository extends JpaRepository<RecentTransaction, String> {
    @Query(value = """
    SELECT RecordID AS recordID,
                Patron AS patronName, 
               Action AS action,
               BookName bookName,
               TransactionTime AS time
        FROM RecentTransactions                    
        ORDER BY TransactionTime DESC 
""", nativeQuery = true)
    List<PatronRecentActivity> getSomePatronReasonActivities();
}
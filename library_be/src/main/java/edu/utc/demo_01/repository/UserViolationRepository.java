package edu.utc.demo_01.repository;

import edu.utc.demo_01.dto.librarian.response.PatronViolationResponse;
import edu.utc.demo_01.dto.librarian.response.ViolationCountResponse;
import edu.utc.demo_01.dto.librarian.response.ViolationStatistic;
import edu.utc.demo_01.dto.patron.response.ViolationsResponse;
import edu.utc.demo_01.entity.User;
import edu.utc.demo_01.entity.UserViolation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface UserViolationRepository extends JpaRepository<UserViolation, String> {
    UserViolation findByViolationID(String violationID);
    int countByUserID(User userID);
    @Query(value = """
    SELECT FullName AS staffName, 
               ViolationType AS violationType,
               Description AS description,
               PointsDeducted AS pointsDeducted,
               PenaltyAmount AS penaltyAmount,
               ViolationDate AS violationDate
        FROM UserViolation v
        JOIN Users u ON u.UserID=v.RecordedBy
        WHERE v.userID = :id 
        ORDER BY ViolationDate DESC 
""", nativeQuery = true)
    List<ViolationsResponse> getUserViolations(@Param("id") String id);
    @Query(value = """
    SELECT
        ViolationID AS violationID,
        p.FullName AS patronName,
        p.UserImage AS patronImage,
        ViolationType AS violationType,
        BookName AS bookName,
        v.Description AS description,
        v.PenaltyAmount AS penaltyAmount,
        v.PointsDeducted AS pointsDeducted,
        l.FullName AS recordedBy,
        ViolationDate AS recordedAt         
    FROM
        UserViolation v         
    JOIN
        Users p 
            ON p.UserID = v.UserID         
    JOIN
        Users l 
            ON l.UserID = v.RecordedBy
    LEFT JOIN
        BorrowRecords br 
            ON br.RecordID = v.RecordID        
    LEFT JOIN
        Books b 
            ON b.BookID = br.BookID
    ORDER BY
        ViolationDate DESC 
""", nativeQuery = true)
    List<PatronViolationResponse> getAllPatronViolations();

    @Query(value = """
    WITH Months AS (
        SELECT 1 AS Month UNION ALL
        SELECT 2 UNION ALL
        SELECT 3 UNION ALL
        SELECT 4 UNION ALL
        SELECT 5 UNION ALL
        SELECT 6 UNION ALL
        SELECT 7 UNION ALL
        SELECT 8 UNION ALL
        SELECT 9 UNION ALL
        SELECT 10 UNION ALL
        SELECT 11 UNION ALL
        SELECT 12
    ),
    ViolationsByMonth AS (
        SELECT 
            MONTH(ViolationDate) AS Month,
            COUNT(*) AS ViolationCount
        FROM 
            UserViolation
        WHERE 
            YEAR(ViolationDate) = :year
        GROUP BY 
            MONTH(ViolationDate)
    )
    SELECT 
        m.Month AS month,
        COALESCE(v.ViolationCount, 0) AS numberOfViolations
    FROM 
        Months m
    LEFT JOIN 
        ViolationsByMonth v ON m.Month = v.Month
    ORDER BY 
        m.Month 
""", nativeQuery = true)
    List<ViolationStatistic> getMonthlyViolationCountByYear(@Param("year") int year);
    @Query(value = """
    SELECT 
        ViolationType,
        COUNT(*) AS ViolationCount
    FROM 
        UserViolation
    WHERE 
        YEAR(ViolationDate) = YEAR(CURRENT_DATE)
    GROUP BY 
        ViolationType
    ORDER BY 
        ViolationCount DESC;
""", nativeQuery = true)
    List<ViolationCountResponse> getViolationCountByTypeThisYear();

    @Query(value = """
    SELECT 
        ViolationType,
        COUNT(*) AS ViolationCount
    FROM 
        UserViolation
    WHERE 
        YEAR(ViolationDate) = YEAR(CURRENT_DATE)
        AND QUARTER(ViolationDate) = QUARTER(CURRENT_DATE)
    GROUP BY 
        ViolationType, QUARTER(ViolationDate)
    ORDER BY 
        ViolationType
""", nativeQuery = true)
    List<ViolationCountResponse> getViolationCountByTypeThisQuarter();

    @Query(value = """
    SELECT 
        ViolationType,
        COUNT(*) AS ViolationCount
    FROM 
        UserViolation
    WHERE 
        YEAR(ViolationDate) = YEAR(CURRENT_DATE)
        AND MONTH(ViolationDate) = MONTH(CURRENT_DATE)
    GROUP BY 
        ViolationType, QUARTER(ViolationDate)
    ORDER BY 
        ViolationType
""", nativeQuery = true)
    List<ViolationCountResponse> getViolationCountByTypeThisMonth();
}
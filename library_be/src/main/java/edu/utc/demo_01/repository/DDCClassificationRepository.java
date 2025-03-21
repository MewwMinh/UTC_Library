package edu.utc.demo_01.repository;

import edu.utc.demo_01.entity.DDCClassification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface DDCClassificationRepository extends JpaRepository<DDCClassification, String> {
    @Query(value = "SELECT * FROM DDCClassification ORDER BY RAND() LIMIT 1", nativeQuery = true)
    DDCClassification findRandomDDC();
    @Query(value = """
SELECT * FROM DDCClassification WHERE DDCName = :ddcName
""", nativeQuery = true)
    Optional<DDCClassification> findByDDCName(@Param("ddcName") String ddcName);
}
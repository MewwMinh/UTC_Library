package edu.utc.demo_01.repository;

import edu.utc.demo_01.entity.DDCClassification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface DDCClassificationRepository extends JpaRepository<DDCClassification, String> {
    @Query(value = "SELECT * FROM DDCClassification ORDER BY RAND() LIMIT 1", nativeQuery = true)
    DDCClassification findRandomDDC();
}
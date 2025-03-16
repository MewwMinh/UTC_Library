package edu.utc.demo_01.repository;

import edu.utc.demo_01.entity.PointHistory;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PointHistoryRepository extends JpaRepository<PointHistory, String> {
}
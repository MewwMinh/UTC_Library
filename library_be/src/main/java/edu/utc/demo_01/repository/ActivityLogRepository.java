package edu.utc.demo_01.repository;

import edu.utc.demo_01.entity.ActivityLog;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ActivityLogRepository extends JpaRepository<ActivityLog, String> {
}
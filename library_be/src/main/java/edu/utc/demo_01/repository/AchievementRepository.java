package edu.utc.demo_01.repository;

import edu.utc.demo_01.entity.Achievement;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AchievementRepository extends JpaRepository<Achievement, String> {
}
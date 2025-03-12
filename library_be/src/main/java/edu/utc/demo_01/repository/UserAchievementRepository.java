package edu.utc.demo_01.repository;

import edu.utc.demo_01.entity.UserAchievement;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserAchievementRepository extends JpaRepository<UserAchievement, String> {
}
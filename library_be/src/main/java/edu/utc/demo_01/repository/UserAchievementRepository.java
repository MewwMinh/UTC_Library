package edu.utc.demo_01.repository;

import edu.utc.demo_01.entity.User;
import edu.utc.demo_01.entity.UserAchievement;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UserAchievementRepository extends JpaRepository<UserAchievement, String> {
    List<UserAchievement> findByUserID(User user);
}
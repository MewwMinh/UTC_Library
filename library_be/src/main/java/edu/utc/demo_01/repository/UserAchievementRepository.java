package edu.utc.demo_01.repository;

import edu.utc.demo_01.dto.patron.response.AchievementResponse;
import edu.utc.demo_01.entity.UserAchievement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface UserAchievementRepository extends JpaRepository<UserAchievement, String> {
    @Query(value = """
        SELECT AchievementName AS achievementName,
                AchievementIcon AS achievementIcon,
                Description AS description,
                AwardedAt AS awardedAt
        FROM Achievements a
        JOIN UserAchievements ua ON a.achievementID = ua.achievementID  
        WHERE UserID = :userID
        ORDER BY awardedAt DESC  
    """, nativeQuery = true)
    List<AchievementResponse> getPatronAchievements(@Param("userID") String userID);
}
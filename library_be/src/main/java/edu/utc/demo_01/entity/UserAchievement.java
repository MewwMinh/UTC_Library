package edu.utc.demo_01.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.time.Instant;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
@DynamicInsert
@Entity
@Table(name = "UserAchievements")
public class UserAchievement {
    @Id
    @Size(max = 36)
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "AchievementID", nullable = false, length = 36)
    private String achievementID;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "UserID", nullable = false)
    private User userID;

    @Size(max = 50)
    @NotNull
    @Column(name = "AchievementType", nullable = false, length = 50)
    private String achievementType;

    @Column(name = "Description", nullable = false)
    private String description;

    @NotNull
    @ColumnDefault("0")
    @Column(name = "PointsAwarded", nullable = false)
    private Integer pointsAwarded;

    @ColumnDefault("CURRENT_TIMESTAMP")
    @Column(name = "AwardedAt")
    private Instant awardedAt;

}
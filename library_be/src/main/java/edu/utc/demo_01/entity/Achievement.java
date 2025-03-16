package edu.utc.demo_01.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.DynamicInsert;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
@DynamicInsert
@Entity
@Table(name = "Achievements")
public class Achievement {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Size(max = 36)
    @Column(name = "AchievementID", nullable = false, length = 36)
    private String achievementID;

    @Size(max = 100)
    @NotNull
    @Column(name = "AchievementName", nullable = false, length = 100)
    private String achievementName;

    @NotNull
    @Column(name = "AchievementIcon", nullable = false, length = 10)
    private String achievementIcon;

    @Column(name = "Description")
    private String description;

    @NotNull
    @ColumnDefault("0")
    @Column(name = "PointsAwarded", nullable = false)
    private Integer pointsAwarded;

}
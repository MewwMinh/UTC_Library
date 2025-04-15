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

import java.time.LocalDateTime;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
@DynamicInsert
@Entity
public class ActivityLog {
    @Id
    @Size(max = 36)
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "LogID", nullable = false, length = 36)
    private String logID;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "ActorID", nullable = false)
    private User actorID;

    @Size(max = 50)
    @Column(name = "ActorRole", length = 50)
    private String actorRole;

    @Size(max = 50)
    @NotNull
    @Column(name = "ActionType", nullable = false, length = 50)
    private String actionType;

    @Size(max = 50)
    @NotNull
    @Column(name = "EntityType", nullable = false, length = 50)
    private String entityType;

    @Size(max = 36)
    @Column(name = "EntityID", length = 36)
    private String entityID;

    @Column(name = "ActionDetails")
    private String actionDetails;

    @NotNull
    @ColumnDefault("CURRENT_TIMESTAMP")
    @Column(name = "ActionTime", nullable = false)
    private LocalDateTime actionTime;

    @Size(max = 50)
    @ColumnDefault("'SUCCESS'")
    @Column(name = "Status", length = 50)
    private String status;

}
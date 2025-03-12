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

import java.math.BigDecimal;
import java.time.Instant;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
@DynamicInsert
@Entity
public class UserViolation {
    @Id
    @Size(max = 36)
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "ViolationID", nullable = false, length = 36)
    private String violationID;

    @ManyToOne(fetch = FetchType.LAZY)
    @OnDelete(action = OnDeleteAction.SET_NULL)
    @JoinColumn(name = "RecordID")
    private BorrowRecord recordID;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "UserID", nullable = false)
    private User userID;

    @ManyToOne(fetch = FetchType.LAZY)
    @OnDelete(action = OnDeleteAction.SET_NULL)
    @JoinColumn(name = "RecordedBy")
    private User recordedBy;

    @Size(max = 50)
    @NotNull
    @Column(name = "ViolationType", nullable = false, length = 50)
    private String violationType;

    @Column(name = "PointsDeducted")
    private Integer pointsDeducted;

    @Column(name = "Description")
    private String description;

    @ColumnDefault("0.00")
    @Column(name = "PenaltyAmount", precision = 10, scale = 2)
    private BigDecimal penaltyAmount;

    @ColumnDefault("(now())")
    @Column(name = "ViolationDate")
    private Instant violationDate;

}
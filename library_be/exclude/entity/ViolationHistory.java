package edu.utc.demo_01.entity;

import edu.utc.demo_01.enums.ViolationType;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.math.BigDecimal;
import java.sql.Timestamp;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
@DynamicInsert
//@Entity
@Table(name = "ViolationHistory")
public class ViolationHistory {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "ViolationID", nullable = false, length = 36)
    private String violationID;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "UserID", nullable = false)
    private User userID;

    @ManyToOne(fetch = FetchType.LAZY)
    @OnDelete(action = OnDeleteAction.SET_NULL)
    @JoinColumn(name = "RecordedBy")
    private User recordedBy;

    @Enumerated(EnumType.STRING)
    @Column(name = "ViolationType", nullable = false)
    private ViolationType violationType;

    @Column(name = "Description")
    private String description;

    @ColumnDefault("0.00")
    @Column(name = "PenaltyAmount", precision = 10, scale = 2)
    private BigDecimal penaltyAmount;

    @Column(name = "ViolationDate")
    private Timestamp violationDate;

}
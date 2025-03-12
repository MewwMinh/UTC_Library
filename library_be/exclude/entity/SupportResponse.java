package edu.utc.demo_01.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.sql.Timestamp;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
@DynamicInsert
//@Entity
@Table(name = "SupportResponses")
public class SupportResponse {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "ResponseID", nullable = false, length = 36)
    private String responseID;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "RequestID", nullable = false)
    private SupportRequest requestID;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "StaffID", nullable = false)
    private User staffID;

    @Column(name = "ResponseText", nullable = false)
    private String responseText;

    @ColumnDefault("(now())")
    @Column(name = "CreatedAt")
    private Timestamp createdAt;

}
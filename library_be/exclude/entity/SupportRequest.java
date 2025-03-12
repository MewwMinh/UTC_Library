package edu.utc.demo_01.entity;

import edu.utc.demo_01.enums.Problem;
import edu.utc.demo_01.enums.RequestStatus;
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
@Table(name = "SupportRequests")
public class SupportRequest {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "RequestID", nullable = false, length = 36)
    private String requestID;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "UserID", nullable = false)
    private User userID;

    @Enumerated(EnumType.STRING)
    @Column(name = "Category", nullable = false)
    private Problem category;

    @Column(name = "Description", nullable = false)
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(name = "Status")
    private RequestStatus status;

    @ColumnDefault("(now())")
    @Column(name = "CreatedAt")
    private Timestamp createdAt;
}
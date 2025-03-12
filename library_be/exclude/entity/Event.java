package edu.utc.demo_01.entity;

import edu.utc.demo_01.enums.EvenStatus;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.DynamicInsert;

import java.sql.Timestamp;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
@DynamicInsert
//@Entity
@Table(name = "Events")
public class Event {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "EventID", nullable = false, length = 36)
    private String eventID;

    @Column(name = "Title", nullable = false)
    private String title;

    @Column(name = "Description")
    private String description;

    @Column(name = "StartTime", nullable = false)
    private Timestamp startTime;

    @Column(name = "EndTime", nullable = false)
    private Timestamp endTime;

    @Column(name = "Location")
    private String location;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "CreatedBy")
    private User createdBy;

    @Enumerated(EnumType.STRING)
    @Column(name = "Status")
    private EvenStatus status;

}
package edu.utc.demo_01.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.hibernate.annotations.DynamicInsert;

import java.time.LocalDateTime;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
@DynamicInsert
@Entity
@Table(name = "Events")
public class Event {
    @Id
    @Size(max = 36)
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "EventID", nullable = false, length = 36)
    private String eventID;

    @Size(max = 255)
    @NotNull
    @Column(name = "Title", nullable = false)
    private String title;

    @Column(name = "Description")
    private String description;

    @NotNull
    @Column(name = "StartTime", nullable = false)
    private LocalDateTime startTime;

    @NotNull
    @Column(name = "EndTime", nullable = false)
    private LocalDateTime endTime;

    @Size(max = 255)
    @Column(name = "Location")
    private String location;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "CreatedBy")
    private User createdBy;

    @Column(name = "MaxAttendees")
    private Integer maxAttendees;
}
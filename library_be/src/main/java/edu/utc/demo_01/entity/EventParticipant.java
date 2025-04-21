package edu.utc.demo_01.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Size;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.DynamicInsert;

import java.time.LocalDateTime;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
@DynamicInsert
@Entity
@Table(name = "EventParticipants")
public class EventParticipant {
    @Id
    @Size(max = 36)
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "EventParticipantID", nullable = false, length = 36)
    private String eventParticipantID;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "EventID")
    private Event eventID;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "UserID")
    private User userID;

    @ColumnDefault("(now())")
    @Column(name = "RegistrationDate")
    private LocalDateTime registrationDate;

    @Size(max = 50)
    @ColumnDefault("'Đã đăng ký'")
    @Column(name = "AttendanceStatus", length = 50)
    private String attendanceStatus;

}
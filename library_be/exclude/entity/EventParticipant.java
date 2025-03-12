package edu.utc.demo_01.entity;

import edu.utc.demo_01.enums.AttendanceStatus;
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
@Table(name = "EventParticipants")
public class EventParticipant {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "EventParticipantID", nullable = false, length = 36)
    private String eventParticipantID;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "EventID")
    private Event eventID;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "UserID")
    private User userID;

    @Column(name = "RegistrationDate")
    private Timestamp registrationDate;

    @Enumerated(EnumType.STRING)
    @Column(name = "AttendanceStatus")
    private AttendanceStatus attendanceStatus;

}
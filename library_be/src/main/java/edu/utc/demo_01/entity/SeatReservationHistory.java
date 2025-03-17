package edu.utc.demo_01.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.time.Instant;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
@DynamicInsert
@Entity
public class SeatReservationHistory {
    @Id
    @Size(max = 36)
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "ReservationID", nullable = false, length = 36)
    private String reservationID;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "UserID", nullable = false)
    private User userID;

    @Size(max = 150)
    @Column(name = "SeatType", length = 150)
    private String seatType;

    @ManyToOne(fetch = FetchType.LAZY)
    @OnDelete(action = OnDeleteAction.SET_NULL)
    @JoinColumn(name = "AcceptBy")
    private User acceptBy;

    @NotNull
    @Column(name = "ReservationTime", nullable = false)
    private Instant reservationTime;

    @NotNull
    @Column(name = "ExpirationTime", nullable = false)
    private Instant expirationTime;

    @Size(max = 50)
    @NotNull
    @Column(name = "Status", nullable = false, length = 50)
    private String status;

    @Size(max = 150)
    @Column(name = "Reason", length = 150)
    private String reason;

}
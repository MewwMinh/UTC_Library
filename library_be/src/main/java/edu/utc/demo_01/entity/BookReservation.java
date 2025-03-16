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

import java.time.LocalDate;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
@DynamicInsert
@Entity
@Table(name = "BookReservations")
public class BookReservation {
    @Id
    @Size(max = 36)
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "ReservationID", nullable = false, length = 36)
    private String reservationID;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "UserID", nullable = false)
    private User userID;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "BookID", nullable = false)
    private Book bookID;

    @ColumnDefault("(now())")
    @Column(name = "ReservationDate")
    private LocalDate reservationDate;

    @NotNull
    @Column(name = "ExpiryDate", nullable = false)
    private LocalDate expiryDate;

    @Size(max = 50)
    @ColumnDefault("'PENDING'")
    @Column(name = "Status", length = 50)
    private String status;

    @NotNull
    @Column(name = "PickupDate", nullable = false)
    private LocalDate pickupDate;

    @ManyToOne(fetch = FetchType.LAZY)
    @OnDelete(action = OnDeleteAction.SET_NULL)
    @JoinColumn(name = "ApprovedBy")
    private User approvedBy;

}
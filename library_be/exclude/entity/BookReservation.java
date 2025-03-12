package edu.utc.demo_01.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import edu.utc.demo_01.enums.ReservationStatus;
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
@Table(name = "BookReservations")
public class BookReservation {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "ReservationID", nullable = false, length = 36)
    private String reservationID;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "UserID", nullable = false)
    private User userID;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "BookID", nullable = false)
    private Book bookID;

    @Column(name = "ReservationDate")
    private Timestamp reservationDate;

    @Column(name = "ExpiryDate", nullable = false)
    private Timestamp expiryDate;

    @Enumerated(EnumType.STRING)
    @Column(name = "Status")
    private ReservationStatus status;

}
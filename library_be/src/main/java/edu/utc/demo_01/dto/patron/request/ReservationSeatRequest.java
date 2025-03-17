package edu.utc.demo_01.dto.patron.request;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.sql.Timestamp;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ReservationSeatRequest {
    String seatType;
    Timestamp reservationTime;
}

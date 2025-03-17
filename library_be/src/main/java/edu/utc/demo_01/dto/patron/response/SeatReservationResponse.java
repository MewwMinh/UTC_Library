package edu.utc.demo_01.dto.patron.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.sql.Timestamp;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class SeatReservationResponse {
    String reservationID;
    String seatType;
    Timestamp reservationTime;
    String status;
    String reason;
    String acceptBy;
}

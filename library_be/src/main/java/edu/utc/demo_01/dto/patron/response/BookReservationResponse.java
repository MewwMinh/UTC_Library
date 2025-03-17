package edu.utc.demo_01.dto.patron.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.Date;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class BookReservationResponse {
    String reservationID;
    String bookName;
    Date reservationDate;
    Date expirationDate;
    Date pickupDate;
    String status;
}

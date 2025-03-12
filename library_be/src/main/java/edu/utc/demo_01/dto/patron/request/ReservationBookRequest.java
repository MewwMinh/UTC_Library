package edu.utc.demo_01.dto.patron.request;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ReservationBookRequest {
    String bookID;
    String pickupDate;
}

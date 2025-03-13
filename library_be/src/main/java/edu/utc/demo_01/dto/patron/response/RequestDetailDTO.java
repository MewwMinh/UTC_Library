package edu.utc.demo_01.dto.patron.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.sql.Timestamp;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class RequestDetailDTO {
    String ticketID;
    String problem;
    String title;
    String description;
    String status;
    Timestamp createAt;
}

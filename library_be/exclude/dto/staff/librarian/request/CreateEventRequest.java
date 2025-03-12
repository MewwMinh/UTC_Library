package edu.utc.demo_01.dto.staff.librarian.request;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.sql.Timestamp;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CreateEventRequest {
    String eventName;
    String description;
    Timestamp startTime;
    Timestamp endTime;
    String location;
    String createBy;
}

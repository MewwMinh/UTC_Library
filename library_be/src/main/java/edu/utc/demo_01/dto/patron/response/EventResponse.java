package edu.utc.demo_01.dto.patron.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.sql.Timestamp;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class EventResponse {
    String eventID;
    String title;
    String description;
    Timestamp startTime;
    Timestamp endTime;
    String location;
}
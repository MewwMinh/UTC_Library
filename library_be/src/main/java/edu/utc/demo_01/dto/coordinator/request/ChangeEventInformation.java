package edu.utc.demo_01.dto.coordinator.request;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ChangeEventInformation {
    String title;
    String description;
    LocalDateTime startTime;
    LocalDateTime endTime;
    String location;
    Integer maxAttendees;
}

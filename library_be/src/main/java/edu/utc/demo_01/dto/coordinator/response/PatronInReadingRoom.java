package edu.utc.demo_01.dto.coordinator.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class PatronInReadingRoom {
    String recordID;
    String patronID;
    String patronName;
    String patronImage;
    LocalDateTime checkInTime;
    String checkInBy;
}

package edu.utc.demo_01.dto.coordinator.request;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ChangePatronInformation {
    String userID;
    String fullName;
    String status;
    LocalDate dob;
    String gender;
    Integer plusDays;
    Integer memberPoints;
    String role;
}

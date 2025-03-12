package edu.utc.demo_01.dto.coordinator.request;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CreatePatron {
    String userID;
    String fullName;
    String gender;
    String userType;
    LocalDate dob;
    String userImage;
    String nationalID;
    String email;
    String staffID;
}

package edu.utc.demo_01.dto.manager.request;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class EmployeeCreateRequest {
    String userID;
    String userName;
    String userImage;
    String gender;
    String email;
    String role;
    LocalDate createAt;
    LocalDate dob;
    String nationalID;
}

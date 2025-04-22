package edu.utc.demo_01.dto.manager.request;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class EmployeeUpdateRequest {
    String userName;
    String gender;
    String status;
    String email;
    String role;
    LocalDate dob;
    String nationalID;
}

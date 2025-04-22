package edu.utc.demo_01.dto.manager.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.sql.Date;
import java.sql.Timestamp;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class EmployeeDetails {
    String userID;
    String userName;
    String userImage;
    String gender;
    String status;
    String email;
    String role;
    Date createAt;
    Date dob;
    String nationalID;
    Timestamp lastLoginAt;
}

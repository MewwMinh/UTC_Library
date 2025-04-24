package edu.utc.demo_01.dto.auth;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserDetailInformation {
    String userID;
    String userName;
    String status;
    LocalDate createdAt;
    LocalDate dob;
    String gender;
    String userImage;
    String nationalID;
    String roleName;
    String email;
    LocalDateTime lastLogin;
}

package edu.utc.demo_01.dto.manager.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class EmployeeInformation {
    String userID;
    String userName;
    String userImage;
    String gender;
    String status;
    String email;
    String role;
}

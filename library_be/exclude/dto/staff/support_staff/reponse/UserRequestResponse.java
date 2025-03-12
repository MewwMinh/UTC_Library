package edu.utc.demo_01.dto.staff.support_staff.reponse;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.sql.Timestamp;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserRequestResponse {
    String requestID;
    String username;
    String problem;
    String status;
    Timestamp createAt;
}

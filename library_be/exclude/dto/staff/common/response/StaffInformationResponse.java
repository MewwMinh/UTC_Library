package edu.utc.demo_01.dto.staff.common.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.sql.Date;
import java.sql.Timestamp;
import java.time.LocalDate;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class StaffInformationResponse {
    String staffID;
    String fullName;
    String userType;
    String status;
    Date createdAt;
    String email;
    String roleName;
}

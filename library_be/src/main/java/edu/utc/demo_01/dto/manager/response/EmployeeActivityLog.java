package edu.utc.demo_01.dto.manager.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.sql.Timestamp;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class EmployeeActivityLog {
    String logID;
    String userID;
    String userName;
    String userImage;
    String userRole;
    String actionType;
    String entityType;
    String entityID;
    String actionDetails;
    Timestamp actionTime;
    String status;
}

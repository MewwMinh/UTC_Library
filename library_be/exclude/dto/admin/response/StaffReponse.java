package edu.utc.demo_01.dto.admin.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class StaffReponse {
    String fullName;
    String email;
    String roleName;
    String status;
}

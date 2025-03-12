package edu.utc.demo_01.dto.admin.request;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CreateStaffRequest {
    String fullName;
    String email;
    String password;
    String roleName;
}

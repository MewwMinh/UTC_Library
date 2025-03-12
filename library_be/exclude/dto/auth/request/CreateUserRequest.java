package edu.utc.demo_01.dto.auth.request;

import edu.utc.demo_01.enums.UserType;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CreateUserRequest {
    String fullName;
    String email;
    String roleName;
}

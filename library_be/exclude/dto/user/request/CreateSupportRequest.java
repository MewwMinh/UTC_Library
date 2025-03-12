package edu.utc.demo_01.dto.user.request;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CreateSupportRequest {
    String userID;
    String problem;
    String description;
}

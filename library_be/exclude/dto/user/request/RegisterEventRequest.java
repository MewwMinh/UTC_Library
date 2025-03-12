package edu.utc.demo_01.dto.user.request;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class RegisterEventRequest {
    String userID;
    String eventID;
}

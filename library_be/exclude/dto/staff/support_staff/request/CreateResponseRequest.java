package edu.utc.demo_01.dto.staff.support_staff.request;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CreateResponseRequest {
    String requestID;
    String staffID;
    String responseText;
}

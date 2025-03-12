package edu.utc.demo_01.dto.admin.request;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class SetStaffStatusRequest {
    String staffID;
    String status;
}

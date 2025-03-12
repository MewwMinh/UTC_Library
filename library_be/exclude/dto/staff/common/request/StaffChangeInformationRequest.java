package edu.utc.demo_01.dto.staff.common.request;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class StaffChangeInformationRequest {
    String name;
}

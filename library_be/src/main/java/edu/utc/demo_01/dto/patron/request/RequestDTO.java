package edu.utc.demo_01.dto.patron.request;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class RequestDTO {
    String title;
    String problem;
    String description;
}

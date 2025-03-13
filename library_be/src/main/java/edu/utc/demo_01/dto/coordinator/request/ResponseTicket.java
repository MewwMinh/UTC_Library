package edu.utc.demo_01.dto.coordinator.request;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ResponseTicket {
    String ticketID;
    String title;
    String responseText;
}

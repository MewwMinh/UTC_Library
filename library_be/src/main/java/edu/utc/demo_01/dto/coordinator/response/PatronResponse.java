package edu.utc.demo_01.dto.coordinator.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class PatronResponse {
    String patronID;
    String patronName;
    String patronImage;
    String patronEmail;
    String membershipType;
    int memberPoints;
    String patronStatus;
}

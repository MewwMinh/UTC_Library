package edu.utc.demo_01.dto.coordinator.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.sql.Date;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class PatronDetailsResponse {
    String patronID;
    String patronName;
    String patronImage;
    String patronEmail;
    String membershipType;
    int memberPoints;
    String patronStatus;
    Date createdAt;
    Date expiry;
    Date dob;
    String gender;
    String role;
}

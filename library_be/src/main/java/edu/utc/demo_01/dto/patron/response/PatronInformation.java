package edu.utc.demo_01.dto.patron.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.sql.Date;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class PatronInformation {
    String userID;
    String userName;
    String gender;
    Integer memberPoints;
    String userImage;
    Date dateOfBirth;
    Date creationDate;
    Date expirationDate;
    String role;
    String email;
    String membershipType;
}

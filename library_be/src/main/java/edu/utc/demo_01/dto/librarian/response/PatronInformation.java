package edu.utc.demo_01.dto.librarian.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class PatronInformation {
    String userID;
    String userName;
    Integer memberPoints;
    String userImage;
    String email;
    String membershipType;
}

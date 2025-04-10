package edu.utc.demo_01.dto.librarian.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.sql.Timestamp;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class HelpTicketResponseDetails {
    String ticketID;
    String patronName;
    String problem;
    String title;
    String status;
    Timestamp createdAt;
    String description;
    String userImage;
    String userID;
    String membershipType;
    String email;
    int memberPoints;
}
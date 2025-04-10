package edu.utc.demo_01.dto.librarian.response;

import edu.utc.demo_01.dto.patron.response.RespondDTO;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.sql.Timestamp;
import java.util.List;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class HelpTicketDetail {
    String ticketID;
    String patronName;
    String problem;
    String title;
    String description;
    String status;
    Timestamp createdAt;
    List<RespondDTO> responses;
}

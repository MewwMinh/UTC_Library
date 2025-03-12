package edu.utc.demo_01.dto.staff.librarian.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class EventParticipantReponse {
    String eventParticipantID;
    String userName;
    String membershipTier;
    String attendanceStatus;
}

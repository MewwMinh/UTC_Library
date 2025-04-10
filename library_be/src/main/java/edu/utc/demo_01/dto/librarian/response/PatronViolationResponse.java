package edu.utc.demo_01.dto.librarian.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;
import java.sql.Timestamp;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class PatronViolationResponse {
    String violationID;
    String patronName;
    String patronImage;
    String violationType;
    String bookName;
    String description;
    BigDecimal penaltyAmount;
    Integer pointsDeducted;
    String recordedBy;
    Timestamp recordedAt;
}

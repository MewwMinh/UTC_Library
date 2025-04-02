package edu.utc.demo_01.dto.librarian.request;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CreateViolationRecord {
    String recordID;
    String userID;
    String violationType;
    int pointsDeducted;
    String description;
    String solution;
    BigDecimal penaltyAmount;
}

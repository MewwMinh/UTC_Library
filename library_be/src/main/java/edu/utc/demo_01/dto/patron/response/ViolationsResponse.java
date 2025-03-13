package edu.utc.demo_01.dto.patron.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;
import java.sql.Timestamp;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ViolationsResponse {
    String staffName;
    String violationType;
    String description;
    int pointsDeducted;
    BigDecimal penaltyAmount;
    Timestamp violationDate;
}

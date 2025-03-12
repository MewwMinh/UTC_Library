package edu.utc.demo_01.dto.staff.librarian.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;
import java.sql.Timestamp;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ViolationResponse {
    String violationID;
    String userName;
    String staffName;
    String violationType;
    String description;
    BigDecimal penaltyAmount;
    Timestamp violationDate;
}

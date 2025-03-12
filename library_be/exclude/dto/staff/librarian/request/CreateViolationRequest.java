package edu.utc.demo_01.dto.staff.librarian.request;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CreateViolationRequest {
    String userID;
    String staffID;
    String violationType;
    String description;
    BigDecimal penaltyAmount;
}

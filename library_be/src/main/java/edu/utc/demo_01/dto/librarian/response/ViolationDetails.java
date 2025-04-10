package edu.utc.demo_01.dto.librarian.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ViolationDetails {
    String violationType;
    LocalDateTime violationDate;
    String description;
    BigDecimal penaltyAmount;
    int pointsDeducted;
    String staffName;
    BorrowRecordDetailsReponse borrowRecordDetailsReponse;
    PatronInformation patronInformation;
}

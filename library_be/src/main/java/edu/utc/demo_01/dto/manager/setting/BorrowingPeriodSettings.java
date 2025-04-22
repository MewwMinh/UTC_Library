package edu.utc.demo_01.dto.manager.setting;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class BorrowingPeriodSettings {
    String maximumBorrowingPeriodForReferenceMaterials;

    String semester1_BorrowStartDate;
    String semester1_BorrowEndDate;
    String semester1_LatestReturnDate;

    String semester2_BorrowStartDate;
    String semester2_BorrowEndDate;
    String semester2_LatestReturnDate;
}

package edu.utc.demo_01.dto.manager.setting;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class RewardsAndPenaltiesSettings {
    String bonusPointsForOnTimeBookReturn;
    String pointsDeductedForDamagedBook;
    String pointsDeductedForLateReferenceMaterialsReturn;
    String pointsDeductedForLateTextbookReturn;
    String pointsDeductedForLostBook;
}

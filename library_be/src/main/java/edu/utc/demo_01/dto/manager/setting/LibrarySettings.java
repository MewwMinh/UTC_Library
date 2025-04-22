package edu.utc.demo_01.dto.manager.setting;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class LibrarySettings {
    RewardsAndPenaltiesSettings rewardsAndPenaltiesSettings;
    LateFeeSettings lateFeeSettings;
    BorrowingLimitsSettings borrowingLimitsSettings;
    BorrowingPeriodSettings borrowingPeriodSettings;
}

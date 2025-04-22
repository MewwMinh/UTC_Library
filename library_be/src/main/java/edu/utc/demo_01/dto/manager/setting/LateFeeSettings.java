package edu.utc.demo_01.dto.manager.setting;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class LateFeeSettings {
    String lateFeeMultiplier_ReferenceMaterials_Over30Days;
    String lateFeeMultiplier_ReferenceMaterials_Under30Days;
    String lateFeeMultiplier_Textbook_Over3Months;
    String lateFeeMultiplier_Textbook_Under3Months;
}

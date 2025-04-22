package edu.utc.demo_01.dto.manager.setting;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class BorrowingLimitsSettings {
    String maxReferenceMaterials_BronzeMember;
    String maxReferenceMaterials_SilverMember;
    String maxReferenceMaterials_GoldMember;

    String maxTextbooks_BronzeMember;
    String maxTextbooks_SilverMember;
    String maxTextbooks_GoldMember;
}

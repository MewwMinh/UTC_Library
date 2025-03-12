package edu.utc.demo_01.dto.staff.support_staff.reponse;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ChangeMembershipTierResponse {
    String fullName;
    String oldMembershipTier;
    String newMembershipTier;
}

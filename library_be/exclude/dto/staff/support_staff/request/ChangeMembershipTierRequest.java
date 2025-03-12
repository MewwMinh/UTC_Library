package edu.utc.demo_01.dto.staff.support_staff.request;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ChangeMembershipTierRequest {
    String userId;
    String newMembershipTier;
}

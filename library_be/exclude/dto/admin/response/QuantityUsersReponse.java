package edu.utc.demo_01.dto.admin.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.lang.Long;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class QuantityUsersReponse {
    Long TotalActiveStaff;
    Long TotalInactiveStaff;
    Long TotalUsers;
    Long TotalActiveUsers;
    Long TotalInactiveUsers;
    Long TotalBannedUsers;
}

package edu.utc.demo_01.dto.auth;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CommonInformation {
    String userID;
    String userName;
    String userImage;
}

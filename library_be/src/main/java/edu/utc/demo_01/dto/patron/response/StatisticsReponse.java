package edu.utc.demo_01.dto.patron.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class StatisticsReponse {
    int totalBookBorrowed;
    int totalNearDueBookBorrowed;
    int totalViolation;
    int totalComment;
}

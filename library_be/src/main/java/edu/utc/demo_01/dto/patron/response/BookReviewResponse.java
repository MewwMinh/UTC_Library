package edu.utc.demo_01.dto.user.reponse;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.sql.Timestamp;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class BookReviewResponse {
    String fullName;
    Integer rating;
    String comment;
    Timestamp createdAt;
}

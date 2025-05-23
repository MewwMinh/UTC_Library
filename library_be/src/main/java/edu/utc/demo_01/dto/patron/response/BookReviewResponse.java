package edu.utc.demo_01.dto.patron.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.sql.Date;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class BookReviewResponse {
    String reviewID;
    String fullName;
    String userImage;
    Integer rating;
    String comment;
    Date createdAt;
}

package edu.utc.demo_01.dto.patron.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class BookBriefResponse {
    String bookID;
    String bookName;
    String bookAuthor;
    int availableCopies;
    String ddcName;
    String bookImage;
}

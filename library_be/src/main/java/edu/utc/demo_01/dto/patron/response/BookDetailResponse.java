package edu.utc.demo_01.dto.patron.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class BookDetailResponse {
    String bookName;
    String author;
    String bookType;
    String isbn;
    int totalCopies;
    int availableCopies;
    int publicationYear;
    String language;
    int pages;
    String format;
    String description;
    String coverImage;
    String ddcName;
}

package edu.utc.demo_01.dto.librarian.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class BookResponse {
    String bookID;
    String bookName;
    String author;
    String bookType;
    String isbn;
    Integer totalCopies;
    Integer availableCopies;
    Integer publicationYear;
    String language;
    Integer pageCount;
    String format;
    String description;
    String coverImage;
    String ddcName;
}


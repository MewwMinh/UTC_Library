package edu.utc.demo_01.dto.librarian.request;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ChangeBookInfoRequest {
    String bookName;
    String author;
    String bookType;
    String isbn;
    Integer totalCopies;
    Integer publicationYear;
    String language;
    Integer pageCount;
    String format;
    String description;
    String ddcCode;
}


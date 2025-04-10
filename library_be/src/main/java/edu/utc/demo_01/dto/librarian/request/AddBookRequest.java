package edu.utc.demo_01.dto.librarian.request;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class AddBookRequest {
    String bookName;
    String author;
    String bookType;
    String isbn;
    int totalCopies;
    int publicationYear;
    String language;
    int pageCount;
    String format;
    String description;
    String coverImage;
    String ddcCode;
    int price;
    String location;
}

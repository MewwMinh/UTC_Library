package edu.utc.demo_01.dto.staff.catalog_manager.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class BookResponse {
    String title;
    String author;
    String isbn;
    Integer totalCopies;
    Integer availableCopies;
    String category;
}

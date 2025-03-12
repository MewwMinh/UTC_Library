package edu.utc.demo_01.dto.staff.catalog_manager.request;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class EditBookRequest {
    String bookID;
    String title;
    String author;
    String isbn;
    Integer totalCopies;
    Integer availableCopies;
    List<String> categoryID;
}

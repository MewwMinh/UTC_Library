package edu.utc.demo_01.dto.staff.catalog_manager.request;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CreateBookRequest {
    String title;
    String author;
    String isbn;
    Integer totalCopies;
    List<String> categoryID;
}

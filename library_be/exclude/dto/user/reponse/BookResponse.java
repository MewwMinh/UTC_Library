package edu.utc.demo_01.dto.user.reponse;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class BookResponse {
    String bookID;
    String title;
    String author;
    Integer availableCopies;
    String category;
}

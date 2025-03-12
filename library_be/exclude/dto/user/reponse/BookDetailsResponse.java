package edu.utc.demo_01.dto.user.reponse;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class BookDetailsResponse {
    String title;
    String author;
    Integer availableCopies;
    String category;
    List<BookReviewResponse> reviews;

    public BookDetailsResponse(String title, String author, Integer availableCopies, String category) {
        this.title = title;
        this.author = author;
        this.availableCopies = availableCopies;
        this.category = category;
    }
}

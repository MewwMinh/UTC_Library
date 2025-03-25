package edu.utc.demo_01.dto.librarian.request;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Books {
    String bookID;
    int quantity;
}

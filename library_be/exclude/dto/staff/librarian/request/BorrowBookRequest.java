package edu.utc.demo_01.dto.staff.librarian.request;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class BorrowBookRequest {
    String bookID;
    String userID;
}

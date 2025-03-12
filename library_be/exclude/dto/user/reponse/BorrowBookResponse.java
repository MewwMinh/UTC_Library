package edu.utc.demo_01.dto.user.reponse;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.sql.Timestamp;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class BorrowBookResponse {
    String bookName;
    Timestamp borrowDate;
    Timestamp dueDate;
    Timestamp returnDate;
}

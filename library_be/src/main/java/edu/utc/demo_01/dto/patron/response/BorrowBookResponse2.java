package edu.utc.demo_01.dto.patron.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.sql.Timestamp;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class BorrowBookResponse2 {
    String borrowRecordID;
    String bookID;
    String bookName;
    Timestamp borrowDate;
    Timestamp dueDate;
    Timestamp returnDate;
    String bookImage;
    String author;
}

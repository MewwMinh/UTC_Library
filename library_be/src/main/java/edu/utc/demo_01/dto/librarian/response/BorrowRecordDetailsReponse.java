package edu.utc.demo_01.dto.librarian.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class BorrowRecordDetailsReponse{
    String recordID;
    String bookName;
    LocalDateTime borrowDate;
    LocalDateTime dueDate;
    LocalDateTime returnDate;
}
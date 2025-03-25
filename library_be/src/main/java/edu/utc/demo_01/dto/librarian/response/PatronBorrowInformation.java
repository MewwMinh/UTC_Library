package edu.utc.demo_01.dto.librarian.response;

import edu.utc.demo_01.dto.patron.response.BorrowBookResponse2;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class PatronBorrowInformation {
    String userID;
    String fullName;
    String userImage;
    String status;
    String membershipType;
    List<BorrowBookResponse2> nearAndOverDueBooks;
}

package edu.utc.demo_01.dto.librarian.request;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class LendBookRequest {
    String userID;
    List<String> itemID;
}

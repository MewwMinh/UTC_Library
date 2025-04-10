package edu.utc.demo_01.dto.librarian.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class BookItemResponse{
    String itemID;
    String barcode;
    String status;
    LocalDate acquisitionDate;
    String location;
    String bookCondition;
    String notes;
}
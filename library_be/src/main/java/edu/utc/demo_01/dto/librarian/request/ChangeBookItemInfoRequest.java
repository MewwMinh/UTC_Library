package edu.utc.demo_01.dto.librarian.request;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ChangeBookItemInfoRequest {
    String status;
    LocalDate acquisitionDate;
    String location;
    String bookCondition;
    String notes;
}
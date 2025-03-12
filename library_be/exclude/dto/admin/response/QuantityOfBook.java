package edu.utc.demo_01.dto.admin.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class QuantityOfBook {
    Long TotalBooks;
    BigDecimal TotalBookCopies;
    BigDecimal TotalAvailableBooks;
}

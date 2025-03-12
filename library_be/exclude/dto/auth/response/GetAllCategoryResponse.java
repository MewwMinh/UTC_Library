package edu.utc.demo_01.dto.auth.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class GetAllCategoryResponse {
    String categoryName;
    int bookQuantity;
    String categoryDescription;
}

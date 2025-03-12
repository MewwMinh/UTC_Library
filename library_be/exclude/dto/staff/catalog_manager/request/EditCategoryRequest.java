package edu.utc.demo_01.dto.staff.catalog_manager.request;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class EditCategoryRequest {
    String categoryID;
    String categoryName;
    String categoryDescription;
}

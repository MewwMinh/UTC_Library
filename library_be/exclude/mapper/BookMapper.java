package edu.utc.demo_01.mapper;

import edu.utc.demo_01.dto.staff.catalog_manager.request.CreateBookRequest;
import edu.utc.demo_01.dto.staff.catalog_manager.response.CategoryResponse;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface BookMapper {
    Book createBook(CreateBookRequest request);
    List<CategoryResponse> toCategoryResponse(List<Category> category);
}

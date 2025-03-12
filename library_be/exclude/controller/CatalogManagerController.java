package edu.utc.demo_01.controller;

import edu.utc.demo_01.dto.staff.catalog_manager.request.AddCategoryRequest;
import edu.utc.demo_01.dto.staff.catalog_manager.request.CreateBookRequest;
import edu.utc.demo_01.dto.staff.catalog_manager.request.EditBookRequest;
import edu.utc.demo_01.dto.staff.catalog_manager.request.EditCategoryRequest;
import edu.utc.demo_01.dto.staff.catalog_manager.response.BookResponse;
import edu.utc.demo_01.dto.staff.catalog_manager.response.CategoryResponse;
import edu.utc.demo_01.service.CatalogManagerService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/cm")
@CrossOrigin(origins = "http://localhost:3000")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class CatalogManagerController {
    CatalogManagerService service;
    @GetMapping("get_all_categories")
    public List<CategoryResponse> getAllCategories(){
        return service.getAllCategories();
    }
    @PostMapping("create_category")
    public boolean createCategory(@RequestBody AddCategoryRequest request){
        return service.addCategory(request);
    }
    @PatchMapping("edit_category")
    public boolean editCategory(@RequestBody EditCategoryRequest request){
        return service.editCategory(request);
    }
    @DeleteMapping("delete_category/{categoryId}")
    public boolean deleteCategory(@PathVariable String categoryId){
        return service.deleteCategory(categoryId);
    }
    @GetMapping("get_all_books")
    public List<BookResponse> getAllBooks(){
        return service.getAllBooks();
    }
    @PostMapping("create_book")
    public boolean createBook(@RequestBody CreateBookRequest request){
        return service.createBook(request);
    }
    @PatchMapping("edit_book")
    public boolean editBook(@RequestBody EditBookRequest request){
        return service.editBook(request);
    }
    @DeleteMapping("delete_book/{bookId}")
    public boolean deletebook(@PathVariable String bookId){
        return service.deleteBook(bookId);
    }
    @DeleteMapping("delete_book_review/{id}")
    public boolean deleteBookReview(@PathVariable String id){
        return service.deleteBookReview(id);
    }
}

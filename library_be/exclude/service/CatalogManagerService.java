package edu.utc.demo_01.service;

import edu.utc.demo_01.dto.staff.catalog_manager.request.AddCategoryRequest;
import edu.utc.demo_01.dto.staff.catalog_manager.request.CreateBookRequest;
import edu.utc.demo_01.dto.staff.catalog_manager.request.EditBookRequest;
import edu.utc.demo_01.dto.staff.catalog_manager.request.EditCategoryRequest;
import edu.utc.demo_01.dto.staff.catalog_manager.response.BookResponse;
import edu.utc.demo_01.dto.staff.catalog_manager.response.CategoryResponse;
import edu.utc.demo_01.mapper.BookMapper;
import edu.utc.demo_01.repository.BookCategoryRepository;
import edu.utc.demo_01.repository.BookRepository;
import edu.utc.demo_01.repository.BookReviewRepository;
import edu.utc.demo_01.repository.CategoryRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class CatalogManagerService {
    BookRepository bookRepository;
    CategoryRepository categoryRepository;
    BookCategoryRepository bookCategoryRepository;
    BookMapper bookMapper;
    BookReviewRepository bookReviewRepository;

    public List<CategoryResponse> getAllCategories(){
        return bookMapper.toCategoryResponse(categoryRepository.findAll());
    }

    public boolean addCategory(AddCategoryRequest request){
        Category category = new Category();
        category.setCategoryName(request.getCategoryName());
        category.setDescription(request.getCategoryDescription());
        category.setCreatedAt(Timestamp.valueOf(LocalDateTime.now()));
        category.setUpdatedAt(Timestamp.valueOf(LocalDateTime.now()));
        categoryRepository.save(category);
        return true;
    }

    public boolean editCategory(EditCategoryRequest request){
        Category category = categoryRepository.findById(request.getCategoryID()).orElseThrow();
        if (request.getCategoryName() != null && !request.getCategoryName().trim().isEmpty()) {
            category.setCategoryName(request.getCategoryName());
        }

        if (request.getCategoryDescription() != null && !request.getCategoryDescription().trim().isEmpty()) {
            category.setDescription(request.getCategoryDescription());
        }
        category.setUpdatedAt(Timestamp.valueOf(LocalDateTime.now()));
        categoryRepository.save(category);
        return true;
    }

    public boolean deleteCategory(String categoryId){
        categoryRepository.deleteById(categoryId);
        return true;
    }

    public List<BookResponse> getAllBooks(){
        return bookRepository.findAllBooks();
    }
//    public void getAllBooks(){
//        List<Object[]> results = bookRepository.findAllBooks();
//        for (Object[] row : results) {
//            System.out.println("🔹 Dữ liệu từ database:");
//            for (int i = 0; i < row.length; i++) {
//                Object value = row[i];
//                System.out.println("Cột " + (i + 1) + ": " + value + " | Kiểu dữ liệu: " + (value != null ? value.getClass().getName() : "NULL"));
//            }
//            System.out.println("-----------------------------");
//        }
//    }

    @Transactional
    public boolean createBook(CreateBookRequest request){
        Book book = bookMapper.createBook(request);
        book.setAvailableCopies(request.getTotalCopies());
        book = bookRepository.save(book);
        List<BookCategory> list = new ArrayList<>();
        for (String categoryId : request.getCategoryID()) {
            BookCategory b = new BookCategory();
            b.setCategoryID(categoryRepository.findById(categoryId).orElseThrow());
            b.setBookID(bookRepository.findById(book.getBookID()).orElseThrow());
            list.add(b);
        }
        bookCategoryRepository.saveAll(list);
        return true;
    }

    @Transactional
    public boolean editBook(EditBookRequest request){
        Book book = bookRepository.findByBookID(request.getBookID()).orElseThrow();
        if (request.getTitle() != null && !request.getTitle().trim().isEmpty()) {
            book.setTitle(request.getTitle());
        }

        if (request.getAuthor() != null && !request.getAuthor().trim().isEmpty()) {
            book.setAuthor(request.getAuthor());
        }

        if (request.getIsbn() != null && !request.getIsbn().trim().isEmpty()) {
            book.setIsbn(request.getIsbn());
        }

        if (request.getTotalCopies() != null) {
            book.setTotalCopies(request.getTotalCopies());
        }

        if (request.getAvailableCopies() != null) {
            book.setAvailableCopies(request.getAvailableCopies());
        }

        if (request.getCategoryID() != null){
            List<BookCategory> list = new ArrayList<>();
            for (String categoryId : request.getCategoryID()) {
                BookCategory b = new BookCategory();
                b.setCategoryID(categoryRepository.findById(categoryId).orElseThrow());
                b.setBookID(bookRepository.findById(book.getBookID()).orElseThrow());
                list.add(b);
            }
            bookCategoryRepository.deleteAllByBookID(book);
            bookCategoryRepository.saveAll(list);
        }
        return true;
    }

    public boolean deleteBook(String bookId){
        bookRepository.deleteById(bookId);
        return true;
    }

    @Transactional
    public boolean deleteBookReview(String id){
        bookReviewRepository.deleteByReviewID(id);
        return true;
    }


}

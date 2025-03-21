package edu.utc.demo_01.controller;

import edu.utc.demo_01.dto.APIResponse;
import edu.utc.demo_01.dto.librarian.request.AddBookRequest;
import edu.utc.demo_01.dto.librarian.request.LendBookRequest;
import edu.utc.demo_01.dto.librarian.response.BookResponse;
import edu.utc.demo_01.entity.Book;
import edu.utc.demo_01.service.CloudinaryService;
import edu.utc.demo_01.service.LibrarianService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/librarian")
@CrossOrigin(origins = "http://localhost:5173")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class LibrarianController {
    LibrarianService service;
    CloudinaryService cloudinaryService;
    @PostMapping("lend-book")
    public boolean lendBook(@RequestBody LendBookRequest request) {
        return service.lendBook(request);
    }
    @PostMapping("accept-book-return")
    public boolean acceptBookReturn(@RequestBody LendBookRequest request) {
        return service.acceptBookReturn(request);
    }
    @PostMapping("add-book-to-lib")
    public APIResponse addBook(@RequestBody AddBookRequest request) {
        return service.addBook(request);
    }
    @GetMapping("get-all-books")
    public APIResponse<List<BookResponse>> getAllBooks() {
        return service.getAllBooks();
    }
    @GetMapping("get-book/{id}")
    public APIResponse<Book> getBookById(@PathVariable String id) {
        return service.getBook(id);
    }
    @PutMapping("change-book-info")
    public APIResponse changeBookInfo(@RequestBody Book book) {
        return service.changeBookInformation(book);
    }

    @PostMapping("/cover")
    public String uploadCover(
            @RequestParam("file") MultipartFile file) {

        return service.uploadCover(file);
    }
}

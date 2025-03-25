package edu.utc.demo_01.controller;

import edu.utc.demo_01.dto.APIResponse;
import edu.utc.demo_01.dto.librarian.request.AddBookRequest;
import edu.utc.demo_01.dto.librarian.request.ChangeBookInfoRequest;
import edu.utc.demo_01.dto.librarian.request.LendBookRequest;
import edu.utc.demo_01.dto.librarian.response.BookResponse;
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


    //region Manage Books
    @GetMapping("get-all-books")
    public APIResponse<List<BookResponse>> getAllBooks() {
        return service.getAllBooks();
    }
    @GetMapping("get-book/{id}")
    public APIResponse<BookResponse> getBookById(@PathVariable String id) {
        return service.getBook(id);
    }
    @PatchMapping("change-book-info/{id}")
    public APIResponse changeBookInfo(@RequestBody ChangeBookInfoRequest book, @PathVariable String id) {
        return service.changeBookInformation(id, book);
    }
    @PostMapping("/change-book-cover/{id}")
    public APIResponse changeBookCover(@RequestParam("file") MultipartFile coverImage, @PathVariable String id) {
        return service.changeBookCover(coverImage, id);
    }
    @DeleteMapping("/delete-book/{id}")
    public APIResponse deleteBook(@PathVariable String id) {
        return service.deleteBook(id);
    }
    @PostMapping("/upload-book-cover/{id}")
    public APIResponse<String> uploadBookCover(@RequestParam("file") MultipartFile coverImage, @PathVariable String id) {
        return service.uploadBookCover(coverImage, id);
    }
    @PostMapping("add-book-to-lib")
    public APIResponse addBook(@RequestBody AddBookRequest request) {
        return service.addBook(request);
    }
    @DeleteMapping("delete-book-review/{id}")
    public APIResponse deleteBookReview(@PathVariable String id) {
        return service.deleteBookReview(id);
    }
    //endregion

}

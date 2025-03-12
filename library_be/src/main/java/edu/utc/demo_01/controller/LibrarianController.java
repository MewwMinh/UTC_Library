package edu.utc.demo_01.controller;

import edu.utc.demo_01.dto.librarian.request.LendBookRequest;
import edu.utc.demo_01.service.LibrarianService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/librarian")
@CrossOrigin(origins = "http://localhost:5173")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class LibrarianController {
    LibrarianService service;
    @PostMapping("lend-book")
    public boolean lendBook(@RequestBody LendBookRequest request) {
        return service.lendBook(request);
    }
    @PostMapping("accept-book-return")
    public boolean acceptBookReturn(@RequestBody LendBookRequest request) {
        return service.acceptBookReturn(request);
    }
}

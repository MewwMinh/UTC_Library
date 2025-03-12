package edu.utc.demo_01.controller;

import edu.utc.demo_01.dto.APIResponse;
import edu.utc.demo_01.dto.patron.request.ReservationBookRequest;
import edu.utc.demo_01.dto.patron.request.ReviewBookRequest;
import edu.utc.demo_01.dto.patron.response.*;
import edu.utc.demo_01.service.PatronService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/patron")
@CrossOrigin(origins = "http://localhost:5173")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class PatronController {
    PatronService service;
    @GetMapping("get-patron-information")
    public APIResponse<PatronInformation> getPatronInformation() {
        return service.getPatronInformation();
    }
    @GetMapping("get-5-recent-borrow-books")
    public APIResponse<List<BorrowBookResponse>> get5RecentBorrowBooks(){
        return service.get5RecentBorrowBooks();
    }
    @GetMapping("get-patron-statistics")
    public APIResponse<StatisticsReponse> getPatronStatistics() {
        return service.statistics();
    }
    @GetMapping("get-top-10-user")
    public APIResponse<List<TopPatronReponse>> getTop10User() {
        return service.top10Users();
    }
    @GetMapping("get-top-10-book")
    public APIResponse<List<TopBookResponse>> getTop10Book() {
        return service.top10Books();
    }


    @GetMapping("get-book-details/{id}")
    public APIResponse<BookDetailResponse> getBookDetails(@PathVariable String id) {
        return service.bookDetail(id);
    }
    @GetMapping("get-book-reviews/{id}")
    public APIResponse<List<BookReviewResponse>> getBookReviews(@PathVariable String id) {
        return service.bookReviews(id);
    }
    @PostMapping("review-book")
    public APIResponse<String> reviewBook(@RequestBody ReviewBookRequest request){
        return service.reviewBook(request);
    }
    @GetMapping("check-favorite/{id}")
    public boolean checkFavorite(@PathVariable String id) {
        return service.checkFavorite(id);
    }
    @PostMapping("add-to-favorites")
    public APIResponse<Boolean> addToFavorites(@RequestBody ReviewBookRequest request){
        return service.addFavorite(request.getBookID());
    }
    @PostMapping("remove-from-favorites")
    public APIResponse<Boolean> removeFromFavorites(@RequestBody ReviewBookRequest request){
        return service.removeFavorite(request.getBookID());
    }
    @PostMapping("reserve-book")
    public APIResponse<Boolean> reserveBook(@RequestBody ReservationBookRequest request){
        return service.reserveBook(request);
    }

}

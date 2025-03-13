package edu.utc.demo_01.controller;

import edu.utc.demo_01.dto.APIResponse;
import edu.utc.demo_01.dto.patron.request.RequestDTO;
import edu.utc.demo_01.dto.patron.request.ReservationBookRequest;
import edu.utc.demo_01.dto.patron.request.ReviewBookRequest;
import edu.utc.demo_01.dto.patron.response.*;
import edu.utc.demo_01.entity.UserAchievement;
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

    @GetMapping("get-tech-books")
    public APIResponse<List<BookBriefResponse>> getTechBooks() {
        return service.getTechnologyTopicBooks();
    }
    @GetMapping("get-suggestion-books")
    public APIResponse<List<BookBriefResponse>> getSuggestionBooks() {
        return service.getSuggestionBooks();
    }
    @GetMapping("find-books-by-keyword/{keyword}")
    public APIResponse<List<BookBriefResponse>> findBooksByKeyword(@PathVariable String keyword) {
        return service.findBooksByKeyword(keyword);
    }

    @PostMapping("send-request")
    public boolean sendRequest(@RequestBody RequestDTO request) {
        return service.sendRequest(request);
    }
    @GetMapping("get-request")
    public APIResponse<List<RequestDetailDTO>> getRequest() {
        return service.getMyRequest();
    }
    @GetMapping("get-request/{id}")
    public APIResponse<RequestDetailDTO> getRequestDetails(@PathVariable String id) {
        return service.getRequestDetails(id);
    }
    @GetMapping("get-responses/{id}")
    public APIResponse<List<RespondDTO>> getResponses(@PathVariable String id) {
        return service.getResponses(id);
    }

    @GetMapping("get-borrowing-books")
    public APIResponse<List<BorrowBookResponse1>> getBorrowingBooks() {
        return service.getBorrowingBooks();
    }
    @GetMapping("get-near-and-over-due-books")
    public APIResponse<List<BorrowBookResponse1>> getNearAndOverDueBooks() {
        return service.getNearAndOverDueBooks();
    }
    @GetMapping("get-borrow-records-history")
    public APIResponse<List<BorrowBookResponse1>> getBorrowRecordsHistory() {
        return service.getBorrowRecordsHistory();
    }

    @GetMapping("get-user-achievement")
    public APIResponse<List<UserAchievement>> getUserAchievement() {
        return service.getUserAchievements();
    }
}

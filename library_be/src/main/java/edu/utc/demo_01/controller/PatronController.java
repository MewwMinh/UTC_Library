package edu.utc.demo_01.controller;

import edu.utc.demo_01.dto.APIResponse;
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



    @PostMapping("review-book")
    public boolean reviewBook(@RequestBody ReviewBookRequest request){
        return service.reviewBook(request);
    }


}

package edu.utc.demo_01.controller;

import edu.utc.demo_01.dto.auth.request.CreateUserRequest;
import edu.utc.demo_01.dto.staff.librarian.response.ViolationResponse;
import edu.utc.demo_01.dto.user.reponse.*;
import edu.utc.demo_01.dto.user.request.*;
import edu.utc.demo_01.service.SupportStaffService;
import edu.utc.demo_01.service.UserService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/user")
@CrossOrigin(origins = "http://localhost:3000")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class UserController {
    UserService userService;
    SupportStaffService staffService;
    @PostMapping
//    User createUser(@RequestBody User user) {
//        userService.createUser(user);
//        return user;
//    }
    boolean createUser(@RequestBody CreateUserRequest createUserRequest) {
        return userService.createUser(createUserRequest);
    }

    @GetMapping("find_book/{keyword}")
    List<BookResponse> getAllBooksByTitleOrAuthor(@PathVariable String keyword){
        return userService.getAllBooksByTitleOrAuthor(keyword);
    }
    @PostMapping("/review")
    boolean review(@RequestBody BookReviewRequest request){
        return userService.reviewBook(request);
    }
    @GetMapping("book_detail/{id}")
    BookDetailsResponse getBookDetail(@PathVariable String id){
        return userService.getBookDetail(id);
    }
    @PostMapping("add_favorite")
    boolean addFavorite(@RequestBody AddFavoriteRequest request){
        return userService.addFavorite(request);
    }
    @GetMapping("get_borrow_record/{id}")
    List<BorrowBookResponse> getAllBorrowRecord(@PathVariable String id){
        return userService.getAllBorrowRecord(id);
    }
    @PostMapping("create_book_reservation")
    boolean createBookReservation(@RequestBody CreateBookReservationRequest request){
        return userService.createBookReservationRequest(request);
    }
    @GetMapping("get_all_book_reservation/{id}")
    public List<BookReservationResponse> getAllBookReservationByUserID(@PathVariable String id){
        return userService.getAllBookReservationByUserID(id);
    }
    @PatchMapping("cancel_book_reservation/{id}")
    public BookReservation cancelBookReservationRequest(@PathVariable String id){
        return userService.cancelBookReservationRequest(id);
    }
    @GetMapping("get_mebership_tier/{id}")
    String getMembershipTier(@PathVariable String id){
        return userService.getMembershipTierByUserID(id);
    }
    @GetMapping("get_violations_by_id/{id}")
    List<ViolationResponse> getAllViolationsByUserID(@PathVariable String id){
        return userService.getAllViolationsByUserID(id);
    }
    @GetMapping("get_num_of_book_left/{id}")
    Integer getNumOfBookLeft(@PathVariable String id){
        return userService.getNumberOfBooksLeftToBorrow(id);
    }
    @GetMapping("get_overdue_books/{id}")
    List<BorrowBookResponse> getOverDueBookByUserID(@PathVariable String id){
        return userService.getOverDueBookByUserID(id);
    }
    @PostMapping("sent_request")
    boolean sentRequest(@RequestBody CreateSupportRequest request){
        return userService.sentRequest(request);
    }
    @PatchMapping("renew_book/{id}")
    boolean renewBook(@PathVariable String id){
        return userService.renewBook(id);
    }
    @PostMapping("register_event")
    boolean registerEvent(@RequestBody RegisterEventRequest request){
        return userService.registerEvent(request);
    }
    @PatchMapping("cancel_register_event/{id}")
    boolean cancelRegisterEvent(@PathVariable String id){
        return userService.cancelRegisterEvent(id);
    }
}

package edu.utc.demo_01.controller;

import edu.utc.demo_01.dto.APIResponse;
import edu.utc.demo_01.dto.librarian.request.*;
import edu.utc.demo_01.dto.librarian.response.*;
import edu.utc.demo_01.dto.patron.response.BookBriefResponse;
import edu.utc.demo_01.dto.patron.response.RespondDTO;
import edu.utc.demo_01.repository.BookItemRepository;
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
@CrossOrigin(origins = {"http://localhost:5173", "https://utc-library.vercel.app"})
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class LibrarianController {
    LibrarianService service;
    CloudinaryService cloudinaryService;
    BookItemRepository bookItemRepository;

    //region Librarian Dashboard
    @GetMapping("get-borrow-return-weekly")
    public APIResponse<List<BorrowReturnWeekly>> getWeeklyBorrowReturn(){
        return service.getWeeklyBorrowReturn();
    }
    @GetMapping("get-some-patron-reason-activities")
    public APIResponse<List<PatronRecentActivity>> getSomePatronReasonActivities(){
        return service.getSomePatronReasonActivities();
    }
    //endregion

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
    @GetMapping("get-all-book-items/{id}")
    public APIResponse<List<BookItemResponse>> getAllBookItems(@PathVariable String id){
        return service.getAllBookItems(id);
    }
    @PostMapping("change-book-item-info/{id}")
    public APIResponse changeBookItemInfo(@PathVariable String id, @RequestBody ChangeBookItemInfoRequest request){
        return service.changeBookItemInfo(id, request);
    }
    @DeleteMapping("delete-book-item/{id}")
    public APIResponse deleteBookItem(@PathVariable String id){
        return service.deleteBookItem(id);
    }
    @PostMapping("delete-book-items")
    public APIResponse deleteBooksItem(@RequestBody List<String> itemIDs){
        return service.deleteBooksItem(itemIDs);
    }
    //endregion

    //region Manage Borrow Return
    @GetMapping("get-patron-borrow-information/{id}")
    public APIResponse<PatronBorrowInformation> getPatronBorrowInformation(@PathVariable String id) {
        return service.getPatronBorrowInformation(id);
    }
    @GetMapping("get-book-by-code/{code}")
    public APIResponse<BookBriefResponse> getBookByCode(@PathVariable String code) {
        return service.getBookByCode(code);
    }
    @PostMapping("lend-book")
    public APIResponse lendBook(@RequestBody LendBookRequest request) {
        return service.lendBook(request);
    }
    @PostMapping("accept-book-return/{id}")
    public APIResponse<List<ReturnBookResponse>> acceptBookReturn(@PathVariable String id) {
        return service.acceptBookReturn(id);
    }
    @PostMapping("create-violation-record")
    public APIResponse createViolationRecord(@RequestBody CreateViolationRecord request) {
        return service.createViolationRecord(request);
    }
    @GetMapping("get-patron-return-information/{id}")
    public APIResponse<PatronReturnInformation> getPatronReturnInformation(@PathVariable String id) {
        return service.getPatronReturnInformation(id);
    }
    //endregion

    //region Manage Violation
    @GetMapping("get-all-patron-violation")
    public APIResponse<List<PatronViolationResponse>> getAllPatronViolations(){
        return service.getAllPatronViolations();
    }
    @GetMapping("get-monthly-violation-count-by-year/{year}")
    public APIResponse<List<ViolationStatistic>> getMonthlyViolationCountByYear(@PathVariable int year){
        return service.getMonthlyViolationCountByYear(year);
    }
    @GetMapping("get_violation_count_by_type_this_year")
    public APIResponse<List<ViolationCountResponse>> getViolationCountByTypeThisYear(){
        return service.getViolationCountByTypeThisYear();
    }
    @GetMapping("get_violation_count_by_type_this_quarter")
    public APIResponse<List<ViolationCountResponse>> getViolationCountByTypeThisQuarter(){
        return service.getViolationCountByTypeThisQuarter();
    }
    @GetMapping("get_violation_count_by_type_this_month")
    public APIResponse<List<ViolationCountResponse>> getViolationCountByTypeThisMonth(){
        return service.getViolationCountByTypeThisMonth();
    }
    @GetMapping("get-user-violation-by-violationID/{violationID}")
    public APIResponse<ViolationDetails> getUserViolationByViolationID(@PathVariable String violationID){
        return service.getUserViolationByViolationID(violationID);
    }
    //endregion

    //region Manage Ticket
    @GetMapping("get-ticket-statistic")
    public APIResponse<TicketStatistic> getTicketStatistic(){
        return service.getTicketStatistic();
    }
    @GetMapping("get-all-help-tickets")
    public APIResponse<List<HelpTicketResponse>> getAllHelpTickets(){
        return service.getAllHelpTickets();
    }
    @GetMapping("get-help-ticket-details/{ticketID}")
    public APIResponse<HelpTicketResponseDetails> getHelpTicketDetail(@PathVariable String ticketID){
        return service.getHelpTicketDetail(ticketID);
    }
    @GetMapping("get-response-ticket/{ticketID}")
    public APIResponse<List<RespondDTO>> getListTicketResponse(@PathVariable String ticketID){
        return service.getListTicketResponse(ticketID);
    }
    @PostMapping("reply-to-support-request/{ticketID}")
    public APIResponse replyToSupportRequest(@PathVariable String ticketID, @RequestBody CreateTicketResponse request){
        return service.replyToSupportRequest(ticketID, request);
    }
    //endregion
}

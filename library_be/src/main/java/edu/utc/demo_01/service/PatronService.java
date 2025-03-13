package edu.utc.demo_01.service;

import edu.utc.demo_01.dto.APIResponse;
import edu.utc.demo_01.dto.patron.request.RequestDTO;
import edu.utc.demo_01.dto.patron.request.ReservationBookRequest;
import edu.utc.demo_01.dto.patron.request.ReviewBookRequest;
import edu.utc.demo_01.dto.patron.response.*;
import edu.utc.demo_01.entity.*;
import edu.utc.demo_01.exception.AppException;
import edu.utc.demo_01.exception.ErrorCode;
import edu.utc.demo_01.repository.*;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class PatronService {
    UserRepository userRepository;
    BookRepository bookRepository;
    BorrowRecordRepository borrowRecordRepository;
    BookReviewRepository bookReviewRepository;
    UserViolationRepository userViolationRepository;
    UserFavoriteRepository userFavoriteRepository;
    BookReservationRepository bookReservationRepository;
    HelpTicketRepository helpTicketRepository;
    TicketResponseRepository ticketResponseRepository;
    UserAchievementRepository userAchievementRepository;


    //region Dashboard
    public APIResponse<PatronInformation> getPatronInformation(){
        String userID = SecurityContextHolder.getContext().getAuthentication().getName();
        if (userID == null) throw new AppException(ErrorCode.CAN_NOT_GET_USER_INFORMATION);
        PatronInformation result = userRepository.getPatronInformationByUserID(userID).orElseThrow(() -> new AppException(ErrorCode.CAN_NOT_GET_USER_INFORMATION));
        return APIResponse.<PatronInformation>builder().code(1000).result(result).build();
    }

    public APIResponse<List<BorrowBookResponse>> get5RecentBorrowBooks(){
        String userID = SecurityContextHolder.getContext().getAuthentication().getName();
        if (userID == null) throw new AppException(ErrorCode.CAN_NOT_GET_USER_INFORMATION);
        List<BorrowBookResponse> bookResponseList = borrowRecordRepository.get5RecentBorrowBooks(userID);
        return APIResponse.<List<BorrowBookResponse>>builder().code(1000).result(bookResponseList).build();
    }



    public APIResponse<StatisticsReponse> statistics(){
        String userID = SecurityContextHolder.getContext().getAuthentication().getName();
        if (userID == null) throw new AppException(ErrorCode.CAN_NOT_GET_USER_INFORMATION);
        User user = userRepository.findByUserID(userID).orElseThrow();

        StatisticsReponse statisticsReponse = new StatisticsReponse();
        statisticsReponse.setTotalBookBorrowed(borrowRecordRepository.countByUserID(user));
        statisticsReponse.setTotalNearDueBookBorrowed(borrowRecordRepository.countNearDueDateByUserID(userID));
        statisticsReponse.setTotalViolation(userViolationRepository.countByUserID(user));
        statisticsReponse.setTotalComment(bookReviewRepository.countBookReviewsByUserID(user));
        return APIResponse.<StatisticsReponse>builder().code(1000).result(statisticsReponse).build();
    }

    public APIResponse<List<TopPatronReponse>> top10Users(){
        List<TopPatronReponse> listUser = userRepository.findTop10ByMemberPoints();
        return APIResponse.<List<TopPatronReponse>>builder().code(1000).result(listUser).build();
    }

    public APIResponse<List<TopBookResponse>> top10Books(){
        List<TopBookResponse> list = borrowRecordRepository.findTop10BorrowedBooks();
        return APIResponse.<List<TopBookResponse>>builder().code(1000).result(list).build();
    }
    //endregion

    //region BookDetail
    public APIResponse<BookDetailResponse> bookDetail(String bookID){
        BookDetailResponse result = bookRepository.getBookDetailByBookID(bookID).orElseThrow(() -> new AppException(ErrorCode.CAN_NOT_FIND_BOOK));
        return APIResponse.<BookDetailResponse>builder().code(1000).result(result).build();
    }

    public APIResponse<List<BookReviewResponse>> bookReviews(String bookID){
        List<BookReviewResponse> result = bookReviewRepository.findReviewsByBookId(bookID);
        return APIResponse.<List<BookReviewResponse>>builder().code(1000).result(result).build();
    }

    public boolean checkFavorite(String bookID){
        String userID = SecurityContextHolder.getContext().getAuthentication().getName();
        if (userID == null) throw new AppException(ErrorCode.CAN_NOT_GET_USER_INFORMATION);
        User user = userRepository.findByUserID(userID).orElseThrow();
        Book book = bookRepository.findByBookID(bookID).orElseThrow();

        return userFavoriteRepository.existsByUserIDAndBookID(user,book);
    }

    public APIResponse<Boolean> addFavorite(String bookID){
        String userID = SecurityContextHolder.getContext().getAuthentication().getName();
        if (userID == null) throw new AppException(ErrorCode.CAN_NOT_GET_USER_INFORMATION);
        User user = userRepository.findByUserID(userID).orElseThrow();
        Book book = bookRepository.findByBookID(bookID).orElseThrow();

        UserFavorite userFavorite = new UserFavorite();
        userFavorite.setUserID(user);
        userFavorite.setBookID(book);
        userFavoriteRepository.save(userFavorite);
        return APIResponse.<Boolean>builder().code(1000).result(true).build();
    }

    @Transactional
    public APIResponse<Boolean> removeFavorite(String bookID){
        String userID = SecurityContextHolder.getContext().getAuthentication().getName();
        if (userID == null) throw new AppException(ErrorCode.CAN_NOT_GET_USER_INFORMATION);
        User user = userRepository.findByUserID(userID).orElseThrow();
        Book book = bookRepository.findByBookID(bookID).orElseThrow();
        userFavoriteRepository.deleteByUserIDAndBookID(user,book);
        return APIResponse.<Boolean>builder().code(1000).result(true).build();
    }

    public APIResponse<Boolean> reserveBook(ReservationBookRequest request){
        String userID = SecurityContextHolder.getContext().getAuthentication().getName();
        if (userID == null) throw new AppException(ErrorCode.CAN_NOT_GET_USER_INFORMATION);
        User user = userRepository.findByUserID(userID).orElseThrow();
        Book book = bookRepository.findByBookID(request.getBookID()).orElseThrow(() -> new AppException(ErrorCode.CAN_NOT_FIND_BOOK));

        BookReservation bookReservation = new BookReservation();
        bookReservation.setUserID(user);
        bookReservation.setBookID(book);
        LocalDate pickupDate =LocalDate.parse(request.getPickupDate(), DateTimeFormatter.ofPattern("yyyy-MM-dd"));
        bookReservation.setReservationDate(LocalDate.now());
        bookReservation.setExpiryDate(LocalDate.now().plusDays(7));
        bookReservation.setStatus("Đang đợi xử lý");
        bookReservation.setPickupDate(pickupDate);
        bookReservationRepository.save(bookReservation);
        return APIResponse.<Boolean>builder().code(1000).result(true).build();
    }

    public APIResponse<String> reviewBook(ReviewBookRequest request){
        Book book = bookRepository.findByBookID(request.getBookID()).orElseThrow(() -> new AppException(ErrorCode.CAN_NOT_FIND_BOOK));
        String userID = SecurityContextHolder.getContext().getAuthentication().getName();
        if (userID == null) throw new AppException(ErrorCode.CAN_NOT_GET_USER_INFORMATION);
        User user = userRepository.findByUserID(userID).orElseThrow();

        if (bookReviewRepository.existsByBookIDAndUserID(book,user)) throw new AppException(ErrorCode.USER_REVIEWED);

        BookReview bookReview = new BookReview();
        bookReview.setBookID(book);
        bookReview.setUserID(user);
        bookReview.setRating(request.getRating());
        if (request.getComment() != null) bookReview.setComment(request.getComment());
        bookReview.setCreatedAt(LocalDate.now());
        bookReviewRepository.save(bookReview);
        return APIResponse.<String>builder().code(1000).result("Đánh giá sách thành công").build();
    }
    //endregion

    //region SearchBook
    public APIResponse<List<BookBriefResponse>> getTechnologyTopicBooks(){
        List<BookBriefResponse> result = bookRepository.getBookByDDCCode("600");
        return APIResponse.<List<BookBriefResponse>>builder().code(1000).result(result).build();
    }
    public APIResponse<List<BookBriefResponse>> getSuggestionBooks(){
        List<BookBriefResponse> result = bookRepository.getSuggestionBooks();
        return APIResponse.<List<BookBriefResponse>>builder().code(1000).result(result).build();
    }
    public APIResponse<List<BookBriefResponse>> findBooksByKeyword(String keyword){
        List<BookBriefResponse> result = bookRepository.findBookByTitleOrAuthor(keyword);
        return APIResponse.<List<BookBriefResponse>>builder().code(1000).result(result).build();
    }
    //endregion Request

    //region Request
    public boolean sendRequest(RequestDTO request){
        String userID = SecurityContextHolder.getContext().getAuthentication().getName();
        if (userID == null) throw new AppException(ErrorCode.CAN_NOT_GET_USER_INFORMATION);
        User user = userRepository.findByUserID(userID).orElseThrow();

        HelpTicket helpTicket = new HelpTicket();
        helpTicket.setUserID(user);
        helpTicket.setProblem(request.getProblem());
        helpTicket.setTitle(request.getTitle());
        helpTicket.setDescription(request.getDescription());
        helpTicket.setStatus("Đang chờ xử lý");
        helpTicket.setCreatedAt(Instant.now());
        helpTicketRepository.save(helpTicket);
        return true;
    }

    public APIResponse<List<RequestDetailDTO>> getMyRequest(){
        String userID = SecurityContextHolder.getContext().getAuthentication().getName();
        if (userID == null) throw new AppException(ErrorCode.CAN_NOT_GET_USER_INFORMATION);
        List<RequestDetailDTO> result = helpTicketRepository.findByUserID(userID);
        return APIResponse.<List<RequestDetailDTO>>builder().code(1000).result(result).build();
    }

    public APIResponse<RequestDetailDTO> getRequestDetails(String ticketID){
        RequestDetailDTO result = helpTicketRepository.findTicketDetailByTicketID(ticketID);
        return APIResponse.<RequestDetailDTO>builder().code(1000).result(result).build();
    }
    public APIResponse<List<RespondDTO>> getResponses(String ticketID){
        List<RespondDTO> result = ticketResponseRepository.findByTicketID(ticketID);
        return APIResponse.<List<RespondDTO>>builder().code(1000).result(result).build();
    }
    //endregion

    //region BorrowHistory
    public APIResponse<List<BorrowBookResponse1>> getBorrowingBooks(){
        String userID = SecurityContextHolder.getContext().getAuthentication().getName();
        if (userID == null) throw new AppException(ErrorCode.CAN_NOT_GET_USER_INFORMATION);
        List<BorrowBookResponse1> result = borrowRecordRepository.findBorrowingBooks(userID);
        return APIResponse.<List<BorrowBookResponse1>>builder().code(1000).result(result).build();
    }

    public APIResponse<List<BorrowBookResponse1>> getNearAndOverDueBooks(){
        String userID = SecurityContextHolder.getContext().getAuthentication().getName();
        if (userID == null) throw new AppException(ErrorCode.CAN_NOT_GET_USER_INFORMATION);
        List<BorrowBookResponse1> result = borrowRecordRepository.getNearAndOverDueBooks(userID);
        return APIResponse.<List<BorrowBookResponse1>>builder().code(1000).result(result).build();
    }

    public APIResponse<List<BorrowBookResponse1>> getBorrowRecordsHistory(){
        String userID = SecurityContextHolder.getContext().getAuthentication().getName();
        if (userID == null) throw new AppException(ErrorCode.CAN_NOT_GET_USER_INFORMATION);
        List<BorrowBookResponse1> result = borrowRecordRepository.getBorrowRecordsHistory(userID);
        return APIResponse.<List<BorrowBookResponse1>>builder().code(1000).result(result).build();
    }
    //endregion

    //region Achievement & Violation
    public APIResponse<List<UserAchievement>> getUserAchievements(){
        String userID = SecurityContextHolder.getContext().getAuthentication().getName();
        if (userID == null) throw new AppException(ErrorCode.CAN_NOT_GET_USER_INFORMATION);
        User user = userRepository.findByUserID(userID).orElseThrow();
        List<UserAchievement> result = userAchievementRepository.findByUserID(user);
        return APIResponse.<List<UserAchievement>>builder().code(1000).result(result).build();
    }

    //endregion

}

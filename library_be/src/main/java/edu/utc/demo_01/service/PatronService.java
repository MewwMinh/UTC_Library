package edu.utc.demo_01.service;

import edu.utc.demo_01.dto.APIResponse;
import edu.utc.demo_01.dto.patron.request.*;
import edu.utc.demo_01.dto.patron.response.*;
import edu.utc.demo_01.dto.patron.response.BookReservationResponse;
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
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
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
    EventParticipantRepository eventParticipantRepository;
    EventRepository eventRepository;
    SeatReservationHistoryRepository seatReservationHistoryRepository;
    PointHistoryRepository pointHistoryRepository;
    MembershipRepository membershipRepository;
    RecentTransactionRepository recentTransactionRepository;


    //region Dashboard
    public APIResponse<PatronInformation> getPatronInformation(){
        String userID = SecurityContextHolder.getContext().getAuthentication().getName();
        if (userID == null) throw new AppException(ErrorCode.CAN_NOT_GET_USER_INFORMATION);
        PatronInformation result = userRepository.getPatronInformationByUserID(userID).orElseThrow(() -> new AppException(ErrorCode.CAN_NOT_GET_USER_INFORMATION));
        return APIResponse.<PatronInformation>builder().code(1000).result(result).build();
    }

    public APIResponse<List<BorrowBookResponse1>> get5RecentBorrowBooks(){
        String userID = SecurityContextHolder.getContext().getAuthentication().getName();
        if (userID == null) throw new AppException(ErrorCode.CAN_NOT_GET_USER_INFORMATION);
        List<BorrowBookResponse1> bookResponseList = borrowRecordRepository.get5RecentBorrowBooks(userID);
        return APIResponse.<List<BorrowBookResponse1>>builder().code(1000).result(bookResponseList).build();
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

    @Transactional
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

        RecentTransaction transaction = new RecentTransaction();
        transaction.setRecordID(bookReservation.getReservationID());
        transaction.setPatron(bookReservation.getUserID().getFullName());
        transaction.setAction("đặt mượn");
        transaction.setBookName(bookReservation.getBookID().getBookName());
        transaction.setTransactionTime(Instant.now());
        recentTransactionRepository.save(transaction);

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

    public APIResponse<List<BorrowBookResponse2>> getNearAndOverDueBooks(){
        String userID = SecurityContextHolder.getContext().getAuthentication().getName();
        if (userID == null) throw new AppException(ErrorCode.CAN_NOT_GET_USER_INFORMATION);
        List<BorrowBookResponse2> result = borrowRecordRepository.getNearAndOverDueBooks(userID);
        return APIResponse.<List<BorrowBookResponse2>>builder().code(1000).result(result).build();
    }

    public APIResponse<List<BorrowBookResponse1>> getBorrowRecordsHistory(){
        String userID = SecurityContextHolder.getContext().getAuthentication().getName();
        if (userID == null) throw new AppException(ErrorCode.CAN_NOT_GET_USER_INFORMATION);
        List<BorrowBookResponse1> result = borrowRecordRepository.getBorrowRecordsHistory(userID);
        return APIResponse.<List<BorrowBookResponse1>>builder().code(1000).result(result).build();
    }

    public APIResponse renewBook(String recordID){
        BorrowRecord record = borrowRecordRepository.findByRecordID(recordID).orElseThrow(() -> new AppException(ErrorCode.CAN_NOT_FIND_BORROW_RECORD));
        record.setExtendCount(record.getExtendCount() + 1);
        record.setExtendedDate(Instant.now());
        record.setDueDate(Instant.now().plus(60, ChronoUnit.DAYS));
        borrowRecordRepository.save(record);
        return APIResponse.builder().code(1000).message("Bạn đã gia hạn thành công cuốn " + record.getBookID().getBookName()).build();
    }
    //endregion

    //region Achievement & Violation
    public APIResponse<List<PointHistoryResponse>> getPatronPointHistory(){
        String userID = SecurityContextHolder.getContext().getAuthentication().getName();
        if (userID == null) throw new AppException(ErrorCode.CAN_NOT_GET_USER_INFORMATION);
        List<PointHistoryResponse> result = pointHistoryRepository.getPatronPointHistory(userID);
        return APIResponse.<List<PointHistoryResponse>>builder().code(1000).result(result).build();
    }
    public APIResponse<List<AchievementResponse>> getPatronAchievements(){
        String userID = SecurityContextHolder.getContext().getAuthentication().getName();
        if (userID == null) throw new AppException(ErrorCode.CAN_NOT_GET_USER_INFORMATION);
        List<AchievementResponse> result = userAchievementRepository.getPatronAchievements(userID);
        return APIResponse.<List<AchievementResponse>>builder().code(1000).result(result).build();
    }
    public CommonAchievement getCommonAchievement(){
        String userID = SecurityContextHolder.getContext().getAuthentication().getName();
        if (userID == null) throw new AppException(ErrorCode.CAN_NOT_GET_USER_INFORMATION);
        User user = userRepository.findByUserID(userID).orElseThrow();
        Membership membership = membershipRepository.findByUserID(user);
        CommonAchievement result = new CommonAchievement();
        result.setPoints(user.getMemberPoints());
        result.setRank(membership.getMembershipType());
        if ( membership.getMembershipType().equals("Đồng")){
            result.setNextRank("Bạc");
            result.setPointsToNextRank(500 - user.getMemberPoints());
        } else if (membership.getMembershipType().equals("Bạc")) {
            result.setNextRank("Vàng");
            result.setPointsToNextRank(1000 - user.getMemberPoints());
        } else {

        }
        return result;
    }

    //endregion

    //region Event
    public APIResponse<List<EventResponse>> getAllEvents(){
        List<EventResponse> events = eventRepository.getAllEvents();
        return APIResponse.<List<EventResponse>>builder().code(1000).result(events).build();
    }
    public APIResponse<List<EventResponse>> getAllAttendedEvents(){
        String userID = SecurityContextHolder.getContext().getAuthentication().getName();
        if (userID == null) throw new AppException(ErrorCode.CAN_NOT_GET_USER_INFORMATION);
        List<EventResponse> events = eventParticipantRepository.getAllAttendedEvents(userID);
        return APIResponse.<List<EventResponse>>builder().code(1000).result(events).build();
    }
    public String registerEvent(RegisterEvent request){
        String userID = SecurityContextHolder.getContext().getAuthentication().getName();
        if (userID == null) throw new AppException(ErrorCode.CAN_NOT_GET_USER_INFORMATION);
        if (eventParticipantRepository.isRegisted(userID, request.getEventID()) == 1) throw new AppException(ErrorCode.REGISTED_EVENT);
        User user = userRepository.findByUserID(userID).orElseThrow();
        Event event = eventRepository.findByEventID(request.getEventID()).orElseThrow(() -> new AppException(ErrorCode.CAN_NOT_FIND_EVENT));
        if (event.getStartTime().isBefore(Instant.now())) throw new AppException(ErrorCode.EVENT_TOOK_PLACE);
        EventParticipant eventParticipant = new EventParticipant();
        eventParticipant.setUserID(user);
        eventParticipant.setEventID(event);
        eventParticipant.setRegistrationDate(Instant.now());
        eventParticipant.setAttendanceStatus("Đã đăng ký");
        eventParticipantRepository.save(eventParticipant);
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");
        return "Bạn đã đăng ký tham gia sự kiện " + event.getTitle() + " thành công. Sự kiện sẽ diễn ra vào " + event.getStartTime().atZone(ZoneId.of("Asia/Ho_Chi_Minh")).format(formatter) + " đến " + event.getEndTime().atZone(ZoneId.of("Asia/Ho_Chi_Minh")).format(formatter) + " tại " + event.getLocation() + ". Chúng tôi rất mong chờ sự có mặt của bạn.";
    }

    public APIResponse unregisterEvent(RegisterEvent request){
        String userID = SecurityContextHolder.getContext().getAuthentication().getName();
        if (userID == null) throw new AppException(ErrorCode.CAN_NOT_GET_USER_INFORMATION);
        if (eventParticipantRepository.isRegisted(userID, request.getEventID()) == 0) return APIResponse.builder().code(1014).message("Bạn chưa đăng ký tham gia sự kiện này !!!").build();
        EventParticipant eventParticipant = eventParticipantRepository.findRegistedByUserIDAndEventID(userID, request.getEventID());
        eventParticipant.setAttendanceStatus("Đã hủy đăng ký");
        eventParticipantRepository.save(eventParticipant);
        Event event = eventRepository.findByEventID(request.getEventID()).orElseThrow(() -> new AppException(ErrorCode.CAN_NOT_FIND_EVENT));
        return APIResponse.builder().code(1000).message("Bạn đã hủy đăng ký tham gia sự kiện " + event.getTitle() + " thành công. Chúng tôi rất tiếc vì bạn không thể tham dự, hẹn gặp bạn ở những sự kiện sau.").build();
    }
    //endregion

    //region Reservation
    public APIResponse<List<BookReservationResponse>> getAllBookReservation(){
        String userID = SecurityContextHolder.getContext().getAuthentication().getName();
        if (userID == null) throw new AppException(ErrorCode.CAN_NOT_GET_USER_INFORMATION);
        List<BookReservationResponse> results = bookReservationRepository.findAllByUserID(userID);
        return APIResponse.<List<BookReservationResponse>>builder().code(1000).result(results).build();
    }

    public String cancelBookReservation(String reservationID){
        BookReservation reservation = bookReservationRepository.findByReservationID(reservationID);
        reservation.setStatus("Đã hủy đặt sách");
        bookReservationRepository.save(reservation);
        return "Bạn đã hủy đặt trước cuốn sách " + reservation.getBookID().getBookName() + " thành công!!";
    }

    public String reserveSeat(ReservationSeatRequest request){
        String userID = SecurityContextHolder.getContext().getAuthentication().getName();
        if (userID == null) throw new AppException(ErrorCode.CAN_NOT_GET_USER_INFORMATION);
        User user = userRepository.findByUserID(userID).orElseThrow();
        SeatReservationHistory seatReservationHistory = new SeatReservationHistory();
        seatReservationHistory.setUserID(user);
        seatReservationHistory.setSeatType(request.getSeatType());
        seatReservationHistory.setReservationTime(request.getReservationTime().toInstant());
        seatReservationHistory.setExpirationTime(Instant.now());
        seatReservationHistory.setStatus("Đang chờ xử lý");
        seatReservationHistoryRepository.save(seatReservationHistory);
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");
        return "Yêu cầu đặt " + seatReservationHistory.getSeatType()+ " vào lúc " + seatReservationHistory.getReservationTime().atZone(ZoneId.of("Asia/Ho_Chi_Minh")).format(formatter) + " thành công. Chúng tôi sẽ xử lý yêu cầu của bạn sớm nhất có thể.";
    }
    public String cancelSeatReservation(String reservationID){
        SeatReservationHistory seatReservationHistory =  seatReservationHistoryRepository.findByReservationID(reservationID);
        seatReservationHistory.setStatus("Đã hủy đặt chỗ");
        seatReservationHistoryRepository.save(seatReservationHistory);
        return "Bạn đã hủy đặt " + seatReservationHistory.getSeatType() + " thành công. Hẹn bạn lần khác nhé !!";
    }
    public APIResponse<List<SeatReservationResponse>> getAllSeatReservation(){
        String userID = SecurityContextHolder.getContext().getAuthentication().getName();
        if (userID == null) throw new AppException(ErrorCode.CAN_NOT_GET_USER_INFORMATION);
        List<SeatReservationResponse> result = seatReservationHistoryRepository.findAllByUserID(userID);
        return APIResponse.<List<SeatReservationResponse>>builder().code(1000).result(result).build();
    }
    //endregion
}

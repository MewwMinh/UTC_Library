package edu.utc.demo_01.service;

import edu.utc.demo_01.dto.auth.request.CreateUserRequest;
import edu.utc.demo_01.dto.staff.librarian.response.ViolationResponse;
import edu.utc.demo_01.dto.user.reponse.*;
import edu.utc.demo_01.dto.user.request.*;
import edu.utc.demo_01.enums.*;
import edu.utc.demo_01.repository.*;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class UserService {
    UserRepository userRepository;
    AuthCredentialRepository authCredentialRepository;
    RoleRepository roleRepository;
    UserRoleRepository userRoleRepository;
    MembershipRepository membershipRepository;
    BookRepository bookRepository;
    BookReviewRepository bookReviewRepository;
    UserFavoriteRepository userFavoriteRepository;
    BorrowRecordRepository borrowRecordRepository;
    BookReservationRepository bookReservationRepository;
    ViolationHistoryRepository violationHistoryRepository;
    SupportRequestRepository supportRequestRepository;
    EventParticipantRepository eventParticipantRepository;
    EventRepository eventRepository;
    @Transactional
    public boolean createUser(CreateUserRequest createUserRequest) {
            User user = new User();
            user.setFullName(createUserRequest.getFullName());
            user.setUserType(UserType.USER);
            user = userRepository.save(user);
            Membership membership = new Membership();
            membership.setUserID(user);
            membership.setMembershipType(MembershipTier.ĐỒNG);
            membershipRepository.save(membership);
            AuthCredential authCredential = new AuthCredential();
            authCredential.setUser(user);
            authCredential.setPasswordHash("123");
            authCredential.setEmail(createUserRequest.getEmail());
            authCredentialRepository.save(authCredential);
            UserRole userRole = new UserRole();
            userRole.setUser(user);
            userRole.setRole(roleRepository.findByRoleName(createUserRequest.getRoleName()));
            userRoleRepository.save(userRole);
            return true;
    }

    public List<BookResponse> getAllBooksByTitleOrAuthor(String keyword){
        return bookRepository.findBookByTitleOrAuthor(keyword);
    }

    public boolean reviewBook(BookReviewRequest request){
        Book book = bookRepository.findById(request.getBookID()).orElseThrow();
        User user = userRepository.findById(request.getUserID()).orElseThrow();

        if(bookReviewRepository.existsByBookIDAndUserID(book, user)) return false;

        BookReview review = new BookReview();
        review.setBookID(book);
        review.setUserID(user);
        review.setRating(request.getRating());
        review.setComment(request.getComment());
        review.setCreatedAt(Timestamp.valueOf(LocalDateTime.now()));
        bookReviewRepository.save(review);
        return true;
    }

//    public List<BookReviewResponse> getrv(String id){
//        return bookReviewRepository.findReviewsByBookId(id);
//    }

    public BookDetailsResponse getBookDetail(String id){
        BookDetailsResponse response = bookRepository.bookDetails(id);
        response.setReviews(bookReviewRepository.findReviewsByBookId(id));
        return response;
    }

    public boolean addFavorite(AddFavoriteRequest request){
        Book book = bookRepository.findById(request.getBookID()).orElseThrow();
        User user = userRepository.findById(request.getUserID()).orElseThrow();

        if(userFavoriteRepository.existsByUserIDAndBookID(user, book)) return false;

        UserFavorite favorite = new UserFavorite();
        favorite.setBookID(book);
        favorite.setUserID(user);
        userFavoriteRepository.save(favorite);
        return true;
    }

    public List<BorrowBookResponse> getAllBorrowRecord(String id){
        return borrowRecordRepository.getBorrowRecordsByUserID(id);
    }

    public boolean createBookReservationRequest(CreateBookReservationRequest request){
        BookReservation reservation = new BookReservation();
        reservation.setBookID(bookRepository.findById(request.getBookID()).orElseThrow());
        reservation.setUserID(userRepository.findById(request.getUserID()).orElseThrow());
        reservation.setReservationDate(Timestamp.valueOf(LocalDateTime.now()));
        reservation.setExpiryDate(Timestamp.valueOf(LocalDateTime.now().plusDays(5)));
        bookReservationRepository.save(reservation);
        return true;
    }

    public List<BookReservationResponse> getAllBookReservationByUserID(String id){
        return bookReservationRepository.getAllBookReservationByUserID(id);
    }

    public BookReservation cancelBookReservationRequest(String id){
        BookReservation reservation = bookReservationRepository.findByReservationID(id).orElseThrow();
        reservation.setStatus(ReservationStatus.CANCELED);
        bookReservationRepository.save(reservation);
        return reservation;
    }

    public String getMembershipTierByUserID(String id){
        return membershipRepository.getMembershipTierByUserID(id);
    }

    public List<ViolationResponse> getAllViolationsByUserID(String id){
        return violationHistoryRepository.getAllViolationsByUserID(id);
    }

    public Integer getNumberOfBooksLeftToBorrow(String id){
        Integer n = borrowRecordRepository.getNumberOfBookBorrowedByUserID(id);
        String memberShiptier = membershipRepository.getMembershipTierByUserID(id);
        switch (memberShiptier) {
            case "ĐỒNG":
                n = 5 - n;
                break;
            case "BẠC":
                n = 10 - n;
                break;
            case "VÀNG":
                n = 20 - n;
                break;
            default:
                n = 0;
                break;
        }
        return n;
    }
    public List<BorrowBookResponse> getOverDueBookByUserID(String id){
        return borrowRecordRepository.getOverDueBookByUserID(id);
    }
    public boolean sentRequest(CreateSupportRequest request){
        SupportRequest supportRequest = new SupportRequest();
        supportRequest.setUserID(userRepository.findById(request.getUserID()).orElseThrow());
        supportRequest.setCategory(Problem.valueOf(request.getProblem()));
        supportRequest.setDescription(request.getDescription());
        supportRequest.setStatus(RequestStatus.PENDING);
        supportRequest.setCreatedAt(Timestamp.valueOf(LocalDateTime.now()));
        supportRequestRepository.save(supportRequest);
        return true;
    }
    public boolean renewBook(String id){
        BorrowRecord record = borrowRecordRepository.findById(id).orElseThrow();
        LocalDateTime newDueDate = record.getDueDate().toLocalDateTime().plusDays(10);
        record.setDueDate(Timestamp.valueOf(newDueDate));
        borrowRecordRepository.save(record);
        return true;
    }
    public boolean registerEvent(RegisterEventRequest request){
        EventParticipant participant = new EventParticipant();
        participant.setUserID(userRepository.findById(request.getUserID()).orElseThrow());
        participant.setEventID(eventRepository.findById(request.getEventID()).orElseThrow());
        eventParticipantRepository.save(participant);
        return true;
    }
    public boolean cancelRegisterEvent(String id){
        EventParticipant participant = eventParticipantRepository.findByEventParticipantID(id);
        participant.setAttendanceStatus(AttendanceStatus.CANCELLED);
        eventParticipantRepository.save(participant);
        return true;
    }
}

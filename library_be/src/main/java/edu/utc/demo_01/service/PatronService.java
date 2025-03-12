package edu.utc.demo_01.service;

import edu.utc.demo_01.dto.APIResponse;
import edu.utc.demo_01.dto.patron.request.ReviewBookRequest;
import edu.utc.demo_01.dto.patron.response.*;
import edu.utc.demo_01.entity.Book;
import edu.utc.demo_01.entity.BookReview;
import edu.utc.demo_01.entity.User;
import edu.utc.demo_01.exception.AppException;
import edu.utc.demo_01.exception.ErrorCode;
import edu.utc.demo_01.repository.*;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
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

//    public PatronInformation getPatronInformation(){
//        String userID = SecurityContextHolder.getContext().getAuthentication().getName();
//        if (userID == null) throw new AppException(ErrorCode.CAN_NOT_GET_USER_INFORMATION);
//        Optional<PatronInformation> result = userRepository.getPatronInformationByUserID(userID);
//        System.out.println("Kết quả truy vấn từ database: " + result);
//        if (result.isEmpty()) {
//            throw new AppException(ErrorCode.CAN_NOT_GET_USER_INFORMATION);
//        }
//        return userRepository.getPatronInformationByUserID(userID).orElseThrow(() -> new AppException(ErrorCode.CAN_NOT_GET_USER_INFORMATION));
//
//    }
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

    public boolean reviewBook(ReviewBookRequest request){
        Book book = bookRepository.findByBookID(request.getBookID()).orElseThrow(() -> new AppException(ErrorCode.CAN_NOT_FIND_BOOK));
        String userID = SecurityContextHolder.getContext().getAuthentication().getName();
        if (userID == null) throw new AppException(ErrorCode.CAN_NOT_GET_USER_INFORMATION);
        User user = userRepository.findByUserID(userID).orElseThrow();

        if (bookReviewRepository.existsByBookIDAndUserID(book,user)) return false;

        BookReview bookReview = new BookReview();
        bookReview.setBookID(book);
        bookReview.setUserID(user);
        bookReview.setRating(request.getRating());
        if (request.getComment() != null) bookReview.setComment(request.getComment());
        bookReview.setCreatedAt(LocalDate.now());
        bookReviewRepository.save(bookReview);
        return true;
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
}

package edu.utc.demo_01.service;

import edu.utc.demo_01.dto.APIResponse;
import edu.utc.demo_01.dto.librarian.request.AddBookRequest;
import edu.utc.demo_01.dto.librarian.request.LendBookRequest;
import edu.utc.demo_01.dto.librarian.response.BookResponse;
import edu.utc.demo_01.dto.librarian.response.BorrowReturnWeekly;
import edu.utc.demo_01.dto.librarian.response.PatronRecentActivity;
import edu.utc.demo_01.dto.patron.response.PatronInformation;
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
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class LibrarianService {
    UserRepository userRepository;
    BookRepository bookRepository;
    BorrowRecordRepository borrowRecordRepository;
    UserViolationRepository userViolationRepository;
    UserAchievementRepository userAchievementRepository;
    DDCClassificationRepository ddcClassificationRepository;
    RecentTransactionRepository recentTransactionRepository;
    CloudinaryService cloudinaryService;

    @Transactional
    public boolean lendBook(LendBookRequest request) {
        User user = userRepository.findByUserID(request.getUserID()).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
        Book book = bookRepository.findByBookID(request.getBookID()).orElseThrow(() -> new AppException(ErrorCode.CAN_NOT_FIND_BOOK));

        String librarianID = SecurityContextHolder.getContext().getAuthentication().getName();
        if (librarianID == null) throw new AppException(ErrorCode.CAN_NOT_GET_USER_INFORMATION);
        User librarian = userRepository.findByUserID(librarianID).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        BorrowRecord borrowRecord = new BorrowRecord();
        borrowRecord.setUserID(user);
        borrowRecord.setBookID(book);
        borrowRecord.setBorrowDate(Instant.now());
        borrowRecord.setDueDate(Instant.now().plus(90, ChronoUnit.DAYS));
        borrowRecord.setExtendCount(0);
        borrowRecord.setApprovedBy(librarian);

        borrowRecordRepository.save(borrowRecord);

        RecentTransaction transaction = new RecentTransaction();
        transaction.setRecordID(borrowRecord.getRecordID());
        transaction.setPatron(borrowRecord.getUserID().getFullName());
        transaction.setAction("mượn");
        transaction.setBookName(borrowRecord.getBookID().getBookName());
        transaction.setTransactionTime(Instant.now());
        recentTransactionRepository.save(transaction);
        return true;
    }

    @Transactional
    public boolean acceptBookReturn(LendBookRequest request) {
        String librarianID = SecurityContextHolder.getContext().getAuthentication().getName();
        if (librarianID == null) throw new AppException(ErrorCode.CAN_NOT_GET_USER_INFORMATION);
        User librarian = userRepository.findByUserID(librarianID).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        String borrowRecordID = borrowRecordRepository.findBorrowRecordIDByBookIDAndUserID(request.getBookID(), request.getUserID()).orElseThrow(() -> new AppException(ErrorCode.CAN_NOT_FIND_BORROW_RECORD));
        BorrowRecord borrowRecord = borrowRecordRepository.findByRecordID(borrowRecordID).orElseThrow(() -> new AppException(ErrorCode.CAN_NOT_FIND_BORROW_RECORD));

        borrowRecord.setReturnApprovedBy(librarian);
        borrowRecord.setReturnDate(Instant.now());
        borrowRecordRepository.save(borrowRecord);

        RecentTransaction transaction = new RecentTransaction();
        transaction.setRecordID(borrowRecord.getRecordID());
        transaction.setPatron(borrowRecord.getUserID().getFullName());
        transaction.setAction("trả");
        transaction.setBookName(borrowRecord.getBookID().getBookName());
        transaction.setTransactionTime(Instant.now());
        recentTransactionRepository.save(transaction);

        if (Instant.now().isAfter(borrowRecord.getDueDate())) {
            User user = userRepository.findByUserID(request.getUserID()).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
            long daysLate = ChronoUnit.DAYS.between(borrowRecord.getDueDate(), Instant.now());

            UserViolation userViolation = new UserViolation();
            userViolation.setRecordID(borrowRecord);
            userViolation.setUserID(user);
            userViolation.setRecordedBy(librarian);
            userViolation.setViolationType("Trả sách muộn");
            userViolation.setPointsDeducted(25);
            userViolation.setDescription("Bạn đọc trả sách muộn " + daysLate + " ngày.");
            // Giả sử mỗi ngày trễ phạt 500 VNĐ
            userViolation.setPenaltyAmount(BigDecimal.valueOf(daysLate*500));
            userViolation.setViolationDate(Instant.now());
            userViolationRepository.save(userViolation);

            user.setMemberPoints(user.getMemberPoints() - 25);
            userRepository.save(user);
        } else {
            User user = userRepository.findByUserID(request.getUserID()).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        }
        return true;
    }

    public APIResponse addBook(AddBookRequest request) {
        DDCClassification classification = ddcClassificationRepository.findByDDCName(request.getDdcName()).orElseThrow(() -> new AppException(ErrorCode.CAN_NOT_FIND_CLASSIFICATION));
        if (bookRepository.existsByIsbn(request.getIsbn())) throw new AppException(ErrorCode.ISBN_EXSITED);
        Book book = new Book();
        book.setBookName(request.getBookName());
        book.setAuthor(request.getAuthor());
        book.setBookType(request.getBookType());
        book.setIsbn(request.getIsbn());
        book.setTotalCopies(request.getTotalCopies());
        book.setAvailableCopies(request.getTotalCopies());
        book.setPublicationYear(request.getPublicationYear());
        book.setLanguage(request.getLanguage());
        book.setPageCount(request.getPageCount());
        book.setFormat(request.getFormat());
        book.setDescription(request.getDescription());
        book.setCoverImage(request.getCoverImage());
        book.setDDCCode(classification);
        bookRepository.save(book);
        return APIResponse.builder().code(1000).message("Tạo mới thành công sách " + book.getBookName()).build();
    }

    public APIResponse<List<BookResponse>> getAllBooks() {
        return APIResponse.<List<BookResponse>>builder()
                .code(1000)
                .result(bookRepository.getAllBooks())
                .build();
    }

    public APIResponse<Book> getBook(String bookID) {
        return APIResponse.<Book>builder().code(1000).result(bookRepository.findById(bookID).orElseThrow(() -> new AppException(ErrorCode.CAN_NOT_FIND_BOOK))).build();
    }

    public APIResponse changeBookInformation(Book book){
        bookRepository.save(book);
        return APIResponse.builder().code(1000).message("Sửa đổi thành công thông tin cuốn " + book.getBookName()).build();
    }

    public APIResponse<List<BorrowReturnWeekly>> getBorrowReturnWeekly() {
        return APIResponse.<List<BorrowReturnWeekly>>builder().code(1000).result(borrowRecordRepository.getWeeklyBorrowReturn()).build();
    }

    public APIResponse<List<PatronRecentActivity>> getSomePatronReasonActivities(){
        return APIResponse.<List<PatronRecentActivity>>builder().code(1000).result(recentTransactionRepository.getSomePatronReasonActivities()).build();
    }

    public APIResponse<PatronInformation> getPatronInformation(String patronID){
        return APIResponse.<PatronInformation>builder()
                .code(1000)
                .result(userRepository.getPatronInformationByUserID(patronID).orElseThrow(() -> new AppException(ErrorCode.CAN_NOT_GET_USER_INFORMATION)))
                .build();
    }


    public String uploadCover(MultipartFile coverImage) {
        return cloudinaryService.uploadBookCover(coverImage, "123");

    }


}

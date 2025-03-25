package edu.utc.demo_01.service;

import edu.utc.demo_01.dto.APIResponse;
import edu.utc.demo_01.dto.librarian.request.AddBookRequest;
import edu.utc.demo_01.dto.librarian.request.Books;
import edu.utc.demo_01.dto.librarian.request.ChangeBookInfoRequest;
import edu.utc.demo_01.dto.librarian.request.LendBookRequest;
import edu.utc.demo_01.dto.librarian.response.BookResponse;
import edu.utc.demo_01.dto.librarian.response.PatronBorrowInformation;
import edu.utc.demo_01.dto.patron.response.BorrowBookResponse2;
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

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class LibrarianService {
    CloudinaryService cloudinaryService;
    UserRepository userRepository;
    BookRepository bookRepository;
    BorrowRecordRepository borrowRecordRepository;
    UserViolationRepository userViolationRepository;
    UserAchievementRepository userAchievementRepository;
    DDCClassificationRepository ddcClassificationRepository;
    BookReviewRepository bookReviewRepository;




//    @Transactional
//    public boolean acceptBookReturn(LendBookRequest request) {
//        String librarianID = SecurityContextHolder.getContext().getAuthentication().getName();
//        if (librarianID == null) throw new AppException(ErrorCode.CAN_NOT_GET_USER_INFORMATION);
//        User librarian = userRepository.findByUserID(librarianID).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
//
//        String borrowRecordID = borrowRecordRepository.findBorrowRecordIDByBookIDAndUserID(request.getBookID(), request.getUserID()).orElseThrow(() -> new AppException(ErrorCode.CAN_NOT_FIND_BORROW_RECORD));
//        BorrowRecord borrowRecord = borrowRecordRepository.findByRecordID(borrowRecordID).orElseThrow(() -> new AppException(ErrorCode.CAN_NOT_FIND_BORROW_RECORD));
//
//        borrowRecord.setReturnApprovedBy(librarian);
//        borrowRecord.setReturnDate(Instant.now());
//        borrowRecordRepository.save(borrowRecord);
//
//        if (Instant.now().isAfter(borrowRecord.getDueDate())) {
//            User user = userRepository.findByUserID(request.getUserID()).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
//            long daysLate = ChronoUnit.DAYS.between(borrowRecord.getDueDate(), Instant.now());
//
//            UserViolation userViolation = new UserViolation();
//            userViolation.setRecordID(borrowRecord);
//            userViolation.setUserID(user);
//            userViolation.setRecordedBy(librarian);
//            userViolation.setViolationType("Trả sách muộn");
//            userViolation.setPointsDeducted(25);
//            userViolation.setDescription("Bạn đọc trả sách muộn " + daysLate + " ngày.");
//            // Giả sử mỗi ngày trễ phạt 500 VNĐ
//            userViolation.setPenaltyAmount(BigDecimal.valueOf(daysLate*500));
//            userViolation.setViolationDate(Instant.now());
//            userViolationRepository.save(userViolation);
//
//            user.setMemberPoints(user.getMemberPoints() - 25);
//            userRepository.save(user);
//        } else {
//            User user = userRepository.findByUserID(request.getUserID()).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
//
//        }
//        return true;
//    }


    //region Manage Books
    public APIResponse<List<BookResponse>> getAllBooks() {
        return APIResponse.<List<BookResponse>>builder()
                .code(1000)
                .result(bookRepository.getAllBooks())
                .build();
    }

    public APIResponse<BookResponse> getBook(String bookID) {
        Book book = (bookRepository.findById(bookID).orElseThrow(() -> new AppException(ErrorCode.CAN_NOT_FIND_BOOK)));
        BookResponse result = new BookResponse();
        result.setBookID(book.getBookID());
        result.setBookName(book.getBookName());
        result.setAuthor(book.getAuthor());
        result.setBookType(book.getBookType());
        result.setIsbn(book.getIsbn());
        result.setTotalCopies(book.getTotalCopies());
        result.setAvailableCopies(book.getAvailableCopies());
        result.setPublicationYear(book.getPublicationYear());
        result.setLanguage(book.getLanguage());
        result.setPageCount(book.getPageCount());
        result.setFormat(book.getFormat());
        result.setDescription(book.getDescription());
        result.setCoverImage(book.getCoverImage());
        result.setDdcCode(book.getDDCCode().getDDCCode());
        return APIResponse.<BookResponse>builder().code(1000).result(result).build();
    }

    public APIResponse changeBookInformation(String bookID, ChangeBookInfoRequest request){
        Book book =  bookRepository.findByBookID(bookID).orElseThrow(() -> new AppException(ErrorCode.CAN_NOT_FIND_BOOK));
        book.setBookName(request.getBookName());
        book.setAuthor(request.getAuthor());
        book.setBookType(request.getBookType());
        book.setIsbn(request.getIsbn());
        int bookAdd = request.getTotalCopies() - book.getTotalCopies();
        book.setTotalCopies(request.getTotalCopies());
        book.setAvailableCopies(book.getAvailableCopies() + bookAdd);
        book.setPublicationYear(request.getPublicationYear());
        book.setLanguage(request.getLanguage());
        if (request.getPageCount() != null) book.setPageCount(request.getPageCount());
        if (request.getFormat() != null) book.setFormat(request.getFormat());
        if (request.getDescription() != null) book.setDescription(request.getDescription());
        DDCClassification classification = ddcClassificationRepository.findByDDCCode(request.getDdcCode());
        book.setDDCCode(classification);
        bookRepository.save(book);
        return APIResponse.builder().code(1000).message("Sửa đổi thành công thông tin cuốn " + book.getBookName()).build();
    }

    public APIResponse changeBookCover(MultipartFile coverImage, String isbn) {
        Book book = bookRepository.findByIsbn(isbn).orElseThrow(() -> new AppException(ErrorCode.CAN_NOT_FIND_BOOK));
        book.setCoverImage(cloudinaryService.uploadBookCover(coverImage, isbn));
        bookRepository.save(book);
        return APIResponse.builder()
                .code(1000)
                .message("Thay đổi ảnh thành công!!")
                .build();
    }

    public APIResponse deleteBook(String bookID) {
        Book book =  bookRepository.findByBookID(bookID).orElseThrow(() -> new AppException(ErrorCode.CAN_NOT_FIND_BOOK));
        String bookName = book.getBookName();
        bookRepository.deleteById(bookID);
        return APIResponse.builder().code(1000).message("Xóa thành công sách " + bookName).build();
    }

    public APIResponse<String> uploadBookCover(MultipartFile coverImage, String isbn) {
        return APIResponse.<String>builder()
                .code(1000)
                .message("Tải lên ảnh thành công!!")
                .result(cloudinaryService.uploadBookCover(coverImage, isbn))
                .build();
    }

    public APIResponse addBook(AddBookRequest request) {
        DDCClassification classification = ddcClassificationRepository.findByDDCCode(request.getDdcCode());
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
        return APIResponse.builder()
                .code(1000)
                .message("Tạo mới thành công sách " + book.getBookName())
                .build();
    }

    public APIResponse deleteBookReview(String reviewID) {
        BookReview review = bookReviewRepository.findByReviewID(reviewID).orElseThrow(() -> new AppException(ErrorCode.CAN_NOT_FIND_BOOK_REVIEW));
        String patron = review.getUserID().getFullName();
        String book = review.getBookID().getBookName();
        bookReviewRepository.delete(review);
        return APIResponse.builder()
                .code(1000)
                .message("Xóa thành công bình luận của " + patron + " về cuốn sách " + book)
                .build();
    }
    //endregion

    //region Manage Borrow Return
    public APIResponse<PatronBorrowInformation> getPatronBorrowInformation(String patronID) {
        PatronInformation information = userRepository.getPatronInformationByUserID(patronID).orElseThrow(() -> new AppException(ErrorCode.CAN_NOT_GET_USER_INFORMATION));
        List<BorrowBookResponse2> borrow = borrowRecordRepository.getNearAndOverDueBooks(patronID);
        PatronBorrowInformation result = new PatronBorrowInformation();
        result.setUserID(information.getUserID());
        result.setFullName(information.getUserName());
        result.setUserImage(information.getUserImage());
        result.setStatus(information.getStatus());
        result.setMembershipType(information.getMembershipType());
        result.setNearAndOverDueBooks(borrow);
        return APIResponse.<PatronBorrowInformation>builder()
                .code(1000)
                .result(result)
                .build();
    }

    public APIResponse<Book> getBookByCode(String code) {
        return APIResponse.<Book>builder()
                .code(1000)
                .result(bookRepository.findByBookID(code).orElseThrow(() -> new AppException(ErrorCode.CAN_NOT_FIND_BOOK)))
                .build();
    }

    @Transactional
    public APIResponse lendBook(LendBookRequest request) {
        User user = userRepository.findByUserID(request.getUserID()).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
        String librarianID = SecurityContextHolder.getContext().getAuthentication().getName();
        if (librarianID == null) throw new AppException(ErrorCode.CAN_NOT_GET_USER_INFORMATION);
        User librarian = userRepository.findByUserID(librarianID).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        List<Books> books = request.getBooks();

        for(Books book : books) {
            Book b = bookRepository.findByBookID(book.getBookID()).orElseThrow(() -> new AppException(ErrorCode.CAN_NOT_FIND_BOOK));
            for (int i = 0; i < book.getQuantity(); i++) {
                BorrowRecord borrowRecord = new BorrowRecord();
                borrowRecord.setUserID(user);
                borrowRecord.setBookID(b);
                borrowRecord.setBorrowDate(Instant.now());
                borrowRecord.setDueDate(Instant.now().plus(90, ChronoUnit.DAYS));
                borrowRecord.setExtendCount(0);
                borrowRecord.setApprovedBy(librarian);
                borrowRecordRepository.save(borrowRecord);
            }
        }
        return APIResponse.builder().code(1000).message("Thanh cong").build();
    }
    //endregion
}

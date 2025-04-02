package edu.utc.demo_01.service;

import edu.utc.demo_01.dto.APIResponse;
import edu.utc.demo_01.dto.librarian.request.*;
import edu.utc.demo_01.dto.librarian.response.BookResponse;
import edu.utc.demo_01.dto.librarian.response.PatronBorrowInformation;
import edu.utc.demo_01.dto.librarian.response.PatronReturnInformation;
import edu.utc.demo_01.dto.librarian.response.ReturnBookResponse;
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

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class LibrarianService {
    CloudinaryService cloudinaryService;
    LibrarySettingsService librarySettingsService;
    UserRepository userRepository;
    BookRepository bookRepository;
    BorrowRecordRepository borrowRecordRepository;
    UserViolationRepository userViolationRepository;
    UserAchievementRepository userAchievementRepository;
    DDCClassificationRepository ddcClassificationRepository;
    BookReviewRepository bookReviewRepository;
    PointHistoryRepository pointHistoryRepository;
    MembershipRepository membershipRepository;


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
    boolean isWithinRange(LocalDate date, LocalDate start, LocalDate end) {
        return (date.isAfter(start) || date.isEqual(start)) &&
                (date.isBefore(end) || date.isEqual(end));
    }

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
        String librarianID = SecurityContextHolder.getContext().getAuthentication().getName();
        if (librarianID == null) throw new AppException(ErrorCode.CAN_NOT_GET_USER_INFORMATION);
        User librarian = userRepository.findByUserID(librarianID).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        User user = userRepository.findByUserID(request.getUserID()).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
        String membership = membershipRepository.findByUserID(user).getMembershipType();
        if (membership.equals("Vàng")){
            membership = "Gold";
        }
        else if (membership.equals("Bạc")) {
            membership = "Sliver";
        }
        else if (membership.equals("Đồng")) {
            membership = "Bronze";
        }
        else throw new AppException(ErrorCode.UNIDENTIFIED_MEMBERSHIP_TYPE);
        int maxReferenceMaterials = librarySettingsService.getMaxReferenceMaterials(membership);
        int maxTextbooks = librarySettingsService.getMaxTextbooks(membership);

        List<Books> books = request.getBooks();

        for(Books book : books) {
            Book b = bookRepository.findByBookID(book.getBookID()).orElseThrow(() -> new AppException(ErrorCode.CAN_NOT_FIND_BOOK));
            if (b.getAvailableCopies() < book.getQuantity()) throw new AppException(ErrorCode.NOT_ENOUGH_BOOK);
            b.setAvailableCopies(b.getAvailableCopies() - book.getQuantity());
            bookRepository.save(b);
            String bookType = b.getBookType();
            int numberOfBorrowed = borrowRecordRepository.getBorrowedCountByUserIDAndBookType(user.getUserID(), b.getBookType());
            if (bookType.equals("Tài liệu tham khảo")) {
                if (maxReferenceMaterials < numberOfBorrowed + book.getQuantity()) throw new AppException(ErrorCode.BORROWING_MORE_THAN_ALLOWED);
                for (int i = 0; i < book.getQuantity(); i++) {
                    BorrowRecord borrowRecord = new BorrowRecord();
                    borrowRecord.setUserID(user);
                    borrowRecord.setBookID(b);
                    borrowRecord.setBorrowDate(LocalDateTime.now());
                    borrowRecord.setDueDate(LocalDate.now().plusDays(librarySettingsService.getMaximumBorrowingPeriodForReferenceMaterials()).atStartOfDay());
                    borrowRecord.setExtendCount(0);
                    borrowRecord.setApprovedBy(librarian);
                    borrowRecordRepository.save(borrowRecord);
                }
            }
            if (bookType.equals("Giáo trình")) {
                if (maxTextbooks < numberOfBorrowed + book.getQuantity()) throw new AppException(ErrorCode.BORROWING_MORE_THAN_ALLOWED);
                for (int i = 0; i < book.getQuantity(); i++) {
                    BorrowRecord borrowRecord = new BorrowRecord();
                    borrowRecord.setUserID(user);
                    borrowRecord.setBookID(b);
                    borrowRecord.setBorrowDate(LocalDateTime.now());

                    if (LocalDate.now().isAfter(librarySettingsService.getSemester1_BorrowDate("Start").minusDays(1))){
                        LocalDate startDate = librarySettingsService.getSemester1_BorrowDate("Start");
                        LocalDate endDate = librarySettingsService.getSemester1_BorrowDate("End");
                        if (isWithinRange(LocalDate.now(), startDate, endDate)){
                            borrowRecord.setDueDate(librarySettingsService.getSemester1_LatestReturnDate().plusDays(1).atStartOfDay());
                        }
                        else{
                            borrowRecord.setDueDate(librarySettingsService.getSemester2_LatestReturnDate(false).plusDays(1).atStartOfDay());
                        }
                    }
                    else {
                        borrowRecord.setDueDate(librarySettingsService.getSemester2_LatestReturnDate(true).plusDays(1).atStartOfDay());
                    }

                    borrowRecord.setExtendCount(0);
                    borrowRecord.setApprovedBy(librarian);
                    borrowRecordRepository.save(borrowRecord);
                }
            }
        }
        return APIResponse.builder().code(1000).message("Mượn sách thành công").build();
    }

    @Transactional
    public APIResponse acceptBookReturn(String recordID){
        String librarianID = SecurityContextHolder.getContext().getAuthentication().getName();
        if (librarianID == null) throw new AppException(ErrorCode.CAN_NOT_GET_USER_INFORMATION);
        User librarian = userRepository.findByUserID(librarianID).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
        BorrowRecord borrowRecord = borrowRecordRepository.findByRecordID(recordID).orElseThrow(() -> new AppException(ErrorCode.CAN_NOT_FIND_BORROW_RECORD));
        borrowRecord.setReturnApprovedBy(librarian);
        borrowRecord.setReturnDate(LocalDateTime.now());
        borrowRecordRepository.save(borrowRecord);
        Book b = borrowRecord.getBookID();
        b.setAvailableCopies(b.getAvailableCopies() + 1);
        bookRepository.save(b);
        String message;

        if (LocalDateTime.now().isAfter(borrowRecord.getDueDate())) {
            User user = borrowRecord.getUserID();
            long daysLate = ChronoUnit.DAYS.between(borrowRecord.getDueDate(), LocalDateTime.now());

            UserViolation userViolation = new UserViolation();
            userViolation.setRecordID(borrowRecord);
            userViolation.setUserID(user);
            userViolation.setRecordedBy(librarian);
            userViolation.setViolationType("Trả sách muộn");
            userViolation.setDescription("Bạn đọc trả sách muộn " + daysLate + " ngày.");
            userViolation.setSolution("Nộp tiền phạt");
            int penaltyAmount;
            int pointsDeducted;
            if (borrowRecord.getBookID().getBookType().equals("Tài liệu tham khảo")){
                if (daysLate <= 30) penaltyAmount = (int)(librarySettingsService.getLateFeeMultiplier_ReferenceMaterials_Under30Days() * borrowRecord.getBookID().getListedBookPrice());
                else penaltyAmount = (int)(librarySettingsService.getLateFeeMultiplier_ReferenceMaterials_Over30Days() * borrowRecord.getBookID().getListedBookPrice());
                pointsDeducted = librarySettingsService.getPointsDeductedForLateReferenceMaterialsReturn();
            }
            else {
                if (LocalDateTime.now().isBefore(borrowRecord.getDueDate().plusMonths(3))) penaltyAmount = (int) (librarySettingsService.getLateFeeMultiplier_Textbook_Under3Months() * borrowRecord.getBookID().getListedBookPrice());
                else penaltyAmount = (int) (librarySettingsService.getLateFeeMultiplier_Textbook_Over3Months() * borrowRecord.getBookID().getListedBookPrice());
                pointsDeducted = librarySettingsService.getPointsDeductedForLateTextbookReturn();
            }
            userViolation.setPenaltyAmount(BigDecimal.valueOf(penaltyAmount));
            userViolation.setPointsDeducted(pointsDeducted);
            userViolation.setViolationDate(LocalDateTime.now());
            userViolationRepository.save(userViolation);

            if (user.getMemberPoints() - pointsDeducted > 0) user.setMemberPoints(user.getMemberPoints() - pointsDeducted);
            else user.setMemberPoints(0);
            userRepository.save(user);

            PointHistory pointHistory = new PointHistory();
            pointHistory.setUserID(user);
            pointHistory.setPoints(0 - pointsDeducted);
            pointHistory.setReason("Bạn đọc trả sách muộn " + daysLate + " ngày.");
            pointHistory.setUpdatedBy(librarian);
            pointHistory.setCreatedAt(LocalDateTime.now());
            pointHistoryRepository.save(pointHistory);
            message = "Trả sách thành công. Bạn đọc trả sách muộn " + daysLate + " ngày, nộp phạt " + penaltyAmount + "VND";
        }
        else {
            User user = borrowRecord.getUserID();
            int pointBonus = librarySettingsService.getBonusPointsForOnTimeBookReturn();
            user.setMemberPoints(user.getMemberPoints() + pointBonus);
            userRepository.save(user);

            PointHistory pointHistory = new PointHistory();
            pointHistory.setUserID(user);
            pointHistory.setPoints(pointBonus);
            pointHistory.setReason("Bạn đọc trả sách đúng hạn.");
            pointHistory.setUpdatedBy(librarian);
            pointHistory.setCreatedAt(LocalDateTime.now());
            pointHistoryRepository.save(pointHistory);
            message = "Bạn đọc trả sách đúng hạn!";
        }
        return APIResponse.builder().code(1000).message(message).build();
    }

    @Transactional
    public APIResponse<List<ReturnBookResponse>> acceptBookReturn(LendBookRequest request) {
        String librarianID = SecurityContextHolder.getContext().getAuthentication().getName();
        if (librarianID == null) throw new AppException(ErrorCode.CAN_NOT_GET_USER_INFORMATION);
        User librarian = userRepository.findByUserID(librarianID).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
        List<ReturnBookResponse> result = new ArrayList<>();

        List<Books> books = request.getBooks();
        for(Books book : books) {
            Book b = bookRepository.findByBookID(book.getBookID()).orElseThrow();
            String bookType = b.getBookType();
            b.setAvailableCopies(b.getAvailableCopies() + book.getQuantity());
            bookRepository.save(b);
            for (int i = 0; i < book.getQuantity(); i++) {
                String borrowRecordID = borrowRecordRepository.findBorrowRecordIDByBookIDAndUserID(book.getBookID(), request.getUserID()).orElseThrow(() -> new AppException(ErrorCode.CAN_NOT_FIND_BORROW_RECORD));
                BorrowRecord borrowRecord = borrowRecordRepository.findByRecordID(borrowRecordID).orElseThrow(() -> new AppException(ErrorCode.CAN_NOT_FIND_BORROW_RECORD));

                borrowRecord.setReturnApprovedBy(librarian);
                borrowRecord.setReturnDate(LocalDateTime.now());
                borrowRecordRepository.save(borrowRecord);

                if (LocalDateTime.now().isAfter(borrowRecord.getDueDate())) {
                    User user = userRepository.findByUserID(request.getUserID()).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
                    long daysLate = ChronoUnit.DAYS.between(borrowRecord.getDueDate(), LocalDateTime.now());

                    UserViolation userViolation = new UserViolation();
                    userViolation.setRecordID(borrowRecord);
                    userViolation.setUserID(user);
                    userViolation.setRecordedBy(librarian);
                    userViolation.setViolationType("Trả sách muộn");
                    userViolation.setDescription("Bạn đọc trả sách muộn " + daysLate + " ngày.");
                    userViolation.setSolution("Nộp tiền phạt");
                    int penaltyAmount;
                    int pointsDeducted;
                    if (bookType.equals("Tài liệu tham khảo")){
                        if (daysLate <= 30) penaltyAmount = (int)(librarySettingsService.getLateFeeMultiplier_ReferenceMaterials_Under30Days() * borrowRecord.getBookID().getListedBookPrice());
                        else penaltyAmount = (int)(librarySettingsService.getLateFeeMultiplier_ReferenceMaterials_Over30Days() * borrowRecord.getBookID().getListedBookPrice());
                        pointsDeducted = librarySettingsService.getPointsDeductedForLateReferenceMaterialsReturn();
                    }
                    else {
                        if (LocalDateTime.now().isBefore(borrowRecord.getDueDate().plusMonths(3))) penaltyAmount = (int) (librarySettingsService.getLateFeeMultiplier_Textbook_Under3Months() * borrowRecord.getBookID().getListedBookPrice());
                        else penaltyAmount = (int) (librarySettingsService.getLateFeeMultiplier_Textbook_Over3Months() * borrowRecord.getBookID().getListedBookPrice());
                        pointsDeducted = librarySettingsService.getPointsDeductedForLateTextbookReturn();
                    }
                    userViolation.setPointsDeducted(pointsDeducted);
                    userViolation.setViolationDate(LocalDateTime.now());
                    userViolationRepository.save(userViolation);

                    if (user.getMemberPoints() - pointsDeducted > 0) user.setMemberPoints(user.getMemberPoints() - pointsDeducted);
                    else user.setMemberPoints(0);
                    userRepository.save(user);

                    PointHistory pointHistory = new PointHistory();
                    pointHistory.setUserID(user);
                    pointHistory.setPoints(0 - pointsDeducted);
                    pointHistory.setReason("Bạn đọc trả sách muộn " + daysLate + " ngày.");
                    pointHistory.setUpdatedBy(librarian);
                    pointHistory.setCreatedAt(LocalDateTime.now());
                    pointHistoryRepository.save(pointHistory);

                    result.add(new ReturnBookResponse(borrowRecordID, "Trả muộn cuốn " + borrowRecord.getBookID().getBookName() + " " + daysLate + " ngày. Số tiền phạt là: " + penaltyAmount + " VND"));
                }
                else {
                    User user = userRepository.findByUserID(request.getUserID()).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
                    int pointBonus = librarySettingsService.getBonusPointsForOnTimeBookReturn();
                    user.setMemberPoints(user.getMemberPoints() + pointBonus);
                    userRepository.save(user);

                    PointHistory pointHistory = new PointHistory();
                    pointHistory.setUserID(user);
                    pointHistory.setPoints(pointBonus);
                    pointHistory.setReason("Bạn đọc trả sách đúng hạn.");
                    pointHistory.setUpdatedBy(librarian);
                    pointHistory.setCreatedAt(LocalDateTime.now());
                    pointHistoryRepository.save(pointHistory);

                    result.add(new ReturnBookResponse(borrowRecordID, "Trả sách " + borrowRecord.getBookID().getBookName() + " đúng hạn."));
                }
            }
        }
        return APIResponse.<List<ReturnBookResponse>>builder()
                .code(1000)
                .result(result)
                .build();
    }

    public APIResponse createViolationRecord(CreateViolationRecord request) {
        BorrowRecord borrowRecord = borrowRecordRepository.findByRecordID(request.getRecordID()).orElseThrow(() -> new AppException(ErrorCode.CAN_NOT_FIND_BORROW_RECORD));
        User user = borrowRecord.getUserID();
        Book book = borrowRecord.getBookID();
        String librarianID = SecurityContextHolder.getContext().getAuthentication().getName();
        if (librarianID == null) throw new AppException(ErrorCode.CAN_NOT_GET_USER_INFORMATION);
        User librarian = userRepository.findByUserID(librarianID).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        UserViolation userViolation = new UserViolation();
        userViolation.setRecordID(borrowRecord);
        userViolation.setUserID(user);
        userViolation.setRecordedBy(librarian);
        userViolation.setViolationType(request.getViolationType());
        if (request.getViolationType().equals("Mất sách")){
            userViolation.setPointsDeducted(librarySettingsService.getPointsDeductedFor("LostBook"));
        } else if (request.getViolationType().equals("Sách bị hư hỏng")) {
            userViolation.setPointsDeducted(librarySettingsService.getPointsDeductedFor("DamagedBook"));
        } else{
            userViolation.setPointsDeducted(request.getPointsDeducted());
        }
        if (request.getDescription() != null) userViolation.setDescription(request.getDescription());
        userViolation.setSolution(request.getSolution());
        if (request.getSolution().equals("Nộp tiền phạt")){
            userViolation.setPenaltyAmount(request.getPenaltyAmount());
            book.setTotalCopies(book.getTotalCopies() - 1);
            book.setAvailableCopies(book.getAvailableCopies() - 1);
        } else if (request.getSolution().equals("Bồi thường sách mới")) {
            userViolation.setPenaltyAmount(BigDecimal.ZERO);
        } else {
            userViolation.setPenaltyAmount(request.getPenaltyAmount());
        }
        userViolation.setViolationDate(LocalDateTime.now());
        userViolationRepository.save(userViolation);
        return APIResponse.builder().code(1000).message("Tạo mới thành công").build();
    }

    public APIResponse<PatronReturnInformation> getPatronReturnInformation(String patronID) {
        PatronInformation information = userRepository.getPatronInformationByUserID(patronID).orElseThrow(() -> new AppException(ErrorCode.CAN_NOT_GET_USER_INFORMATION));
        List<BorrowBookResponse2> borrow = borrowRecordRepository.findBorrowingBooks(patronID);
        List<BorrowBookResponse2> history = borrowRecordRepository.getBorrowRecordsHistory(patronID);
        PatronReturnInformation result = new PatronReturnInformation();
        result.setUserID(information.getUserID());
        result.setFullName(information.getUserName());
        result.setUserImage(information.getUserImage());
        result.setStatus(information.getStatus());
        result.setMembershipType(information.getMembershipType());
        result.setBorrowingBooks(borrow);
        result.setBorrowHistory(history);
        return APIResponse.<PatronReturnInformation>builder()
                .code(1000)
                .result(result)
                .build();
    }
    //endregion


}

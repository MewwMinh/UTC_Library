package edu.utc.demo_01.service;

import edu.utc.demo_01.dto.APIResponse;
import edu.utc.demo_01.dto.librarian.request.*;
import edu.utc.demo_01.dto.librarian.response.*;
import edu.utc.demo_01.dto.patron.response.BookBriefResponse;
import edu.utc.demo_01.dto.patron.response.BorrowBookResponse2;
import edu.utc.demo_01.dto.patron.response.PatronInformation;
import edu.utc.demo_01.dto.patron.response.RespondDTO;
import edu.utc.demo_01.entity.*;
import edu.utc.demo_01.exception.AppException;
import edu.utc.demo_01.exception.ErrorCode;
import edu.utc.demo_01.repository.*;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.Limit;
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
    BookItemRepository bookItemRepository;
    RecentTransactionRepository recentTransactionRepository;
    HelpTicketRepository helpTicketRepository;
    TicketResponseRepository ticketResponseRepository;
    AuthCredentialRepository authCredentialRepository;

    //region Librarian Dashboard
    public APIResponse<List<BorrowReturnWeekly>> getWeeklyBorrowReturn() {
        return APIResponse.<List<BorrowReturnWeekly>>builder()
                .code(1000)
                .result(borrowRecordRepository.getWeeklyBorrowReturn())
                .build();
    }
    public APIResponse<List<PatronRecentActivity>> getSomePatronReasonActivities(){
        return APIResponse.<List<PatronRecentActivity>>builder()
                .code(1000)
                .result(recentTransactionRepository.getSomePatronReasonActivities())
                .build();
    }
    //endregion

    //region Manage Books
    private String generateBarcode(String prefix, int copyNumber) {
        // Tạo mã barcode theo định dạng ISBN-COPY_NUMBER
        // Ví dụ: 9780123456789-0001
        return prefix + "-" + String.format("%04d", copyNumber);
    }

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
        result.setPrice(book.getPrice());
        return APIResponse.<BookResponse>builder().code(1000).result(result).build();
    }

    public APIResponse changeBookInformation(String bookID, ChangeBookInfoRequest request){
        Book book =  bookRepository.findByBookID(bookID).orElseThrow(() -> new AppException(ErrorCode.CAN_NOT_FIND_BOOK));
        book.setBookName(request.getBookName());
        book.setAuthor(request.getAuthor());
        book.setBookType(request.getBookType());
        book.setIsbn(request.getIsbn());
        book.setPrice(request.getPrice());

        int bookAdd = request.getTotalCopies() - book.getTotalCopies();
        if (bookAdd > 0) {
            List<BookItem> bookItems = new ArrayList<>();
            int barcode = bookItemRepository.getMaxBarcode(bookID);
            for (int i = barcode + 1; i <= barcode + bookAdd; i++) {
                BookItem bookItem = new BookItem();
                bookItem.setBookID(book);
                String barcodePrefix = book.getIsbn().replaceAll("-", "");
                bookItem.setBarcode(generateBarcode(barcodePrefix, i));
                bookItem.setStatus("Có sẵn");
                bookItem.setAcquisitionDate(LocalDate.now());
                if (request.getLocation() != null){
                    bookItem.setLocation(request.getLocation());
                }else {
                    bookItem.setLocation(bookItemRepository.findByBookID(book, Limit.of(1)).getLocation());
                }
                bookItem.setBookCondition("Tốt");
                bookItems.add(bookItem);
            }
            bookItemRepository.saveAll(bookItems);
        }
        if (bookAdd < 0) throw new AppException(ErrorCode.CAN_NOT_PERFORM_THIS_ACTION);
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
        book.setPrice(request.getPrice());
        bookRepository.save(book);

        List<BookItem> bookItems = new ArrayList<>();
        for (int i = 0; i < book.getTotalCopies(); i++) {
            BookItem bookItem = new BookItem();
            bookItem.setBookID(book);
            String barcodePrefix = book.getIsbn().replaceAll("-", "");
            bookItem.setBarcode(generateBarcode(barcodePrefix, i));
            bookItem.setStatus("Có sẵn");
            bookItem.setAcquisitionDate(LocalDate.now());
            bookItem.setLocation(request.getLocation());
            bookItem.setBookCondition("Tốt");
            bookItems.add(bookItem);
        }
        bookItemRepository.saveAll(bookItems);

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

    public APIResponse<List<BookItemResponse>> getAllBookItems(String bookID) {
        Book b = bookRepository.findByBookID(bookID).orElseThrow(() -> new AppException(ErrorCode.CAN_NOT_FIND_BOOK));
        List<BookItem> bookItems = bookItemRepository.findByBookID(b);
        List<BookItemResponse> result = new ArrayList<>();
        for (BookItem bookItem : bookItems) {
            BookItemResponse bookItemResponse = new BookItemResponse();
            bookItemResponse.setItemID(bookItem.getItemID());
            bookItemResponse.setBarcode(bookItem.getBarcode());
            bookItemResponse.setStatus(bookItem.getStatus());
            bookItemResponse.setAcquisitionDate(bookItem.getAcquisitionDate());
            bookItemResponse.setLocation(bookItem.getLocation());
            bookItemResponse.setBookCondition(bookItem.getBookCondition());
            bookItemResponse.setNotes(bookItem.getNotes());
            result.add(bookItemResponse);
        }
        return APIResponse.<List<BookItemResponse>>builder()
                .code(1000)
                .result(result)
                .build();
    }
    public APIResponse changeBookItemInfo(String itemID, ChangeBookItemInfoRequest request) {
        BookItem bookItem = bookItemRepository.findByItemID(itemID).orElseThrow(() -> new AppException(ErrorCode.CAN_NOT_FIND_BOOK));
        if (request.getStatus() != null) bookItem.setStatus(request.getStatus());
        bookItem.setAcquisitionDate(request.getAcquisitionDate());
        bookItem.setLocation(request.getLocation());
        bookItem.setBookCondition(request.getBookCondition());
        bookItem.setNotes(request.getNotes());
        bookItemRepository.save(bookItem);
        return APIResponse.builder().code(1000).message("Thay đổi thông tin sách thành công!!").build();
    }

    public APIResponse deleteBookItem(String itemID) {
        BookItem bookItem = bookItemRepository.findByItemID(itemID).orElseThrow(() -> new AppException(ErrorCode.CAN_NOT_FIND_BOOK));
        bookItemRepository.delete(bookItem);
        return APIResponse.builder().code(1000).message("Xóa sách thành công!!").build();
    }

    public APIResponse deleteBooksItem(List<String> itemIDs) {
        for (String itemID : itemIDs) {
            if (bookItemRepository.existsByItemIDAndAvaiable(itemID) != 1) throw new AppException(ErrorCode.BORROWED_OR_NOT_EXIST);
            bookItemRepository.deleteById(itemID);
        }
        return APIResponse.builder().code(1000).message(STR."Xóa thành công \{itemIDs.toArray().length} sách !").build();
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

    public APIResponse<BookBriefResponse> getBookByCode(String code) {
        if (bookItemRepository.existsByItemIDAndAvaiable(code) != 1) throw new AppException(ErrorCode.BORROWED_OR_NOT_EXIST);
        BookItem bookItem = bookItemRepository.findByItemID(code).orElseThrow(() -> new AppException(ErrorCode.BORROWED_OR_NOT_EXIST));
        Book book = bookItem.getBookID();
        BookBriefResponse bookBriefResponse = new BookBriefResponse();
        bookBriefResponse.setBookID(book.getBookID());
        bookBriefResponse.setBookName(book.getBookName());
        bookBriefResponse.setBookAuthor(book.getAuthor());
        bookBriefResponse.setBookImage(book.getCoverImage());
        bookBriefResponse.setAvailableCopies(book.getAvailableCopies());

        return APIResponse.<BookBriefResponse>builder()
                .code(1000)
                .result(bookBriefResponse)
                .build();
    }


    @Transactional
    public APIResponse lendBook(LendBookRequest request) {
        //Lấy thông tin thủ thư qua token
        String librarianID = SecurityContextHolder.getContext().getAuthentication().getName();
        if (librarianID == null) throw new AppException(ErrorCode.CAN_NOT_GET_USER_INFORMATION);
        User librarian = userRepository.findByUserID(librarianID).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        //Lấy thông tin bạn đọc
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

        //Số sách nhiều nhất được mượn theo hạng thành viên
        int maxReferenceMaterials = librarySettingsService.getMaxReferenceMaterials(membership);
        int maxTextbooks = librarySettingsService.getMaxTextbooks(membership);

        //Duyệt qua danh sách các itemID
        List<String> itemIDs = request.getItemID();
        for(String itemID : itemIDs) {
            //Tìm thông tin sách
            BookItem bookItem = bookItemRepository.findByItemID(itemID).orElseThrow(() -> new AppException(ErrorCode.CAN_NOT_FIND_BOOK));
            Book b = bookItem.getBookID();
            b.setAvailableCopies(b.getAvailableCopies() - 1);
            bookRepository.save(b);
            bookItem.setStatus("Đang mượn");
            bookItemRepository.save(bookItem);
            String bookType = b.getBookType();

            //Tạo bản ghi mượn sách mới
            BorrowRecord borrowRecord = new BorrowRecord();
            borrowRecord.setUserID(user);
            borrowRecord.setBookID(b);
            borrowRecord.setItemID(bookItem);
            borrowRecord.setBorrowDate(LocalDateTime.now());
            borrowRecord.setExtendCount(0);
            borrowRecord.setApprovedBy(librarian);


            //Tính số sách đã mượn theo loại sách
            int numberOfBorrowed = borrowRecordRepository.getBorrowedCountByUserIDAndBookType(user.getUserID(), b.getBookType());
            if (bookType.equals("Tài liệu tham khảo")) {
                //Nếu mượn sách quá giới hạn thì sẽ ném ra lỗi
                if (maxReferenceMaterials < numberOfBorrowed + 1) throw new AppException(ErrorCode.BORROWING_MORE_THAN_ALLOWED);

                //Tính ngày phải trả sách của Tài liệu tham khảo
                borrowRecord.setDueDate(LocalDate.now().plusDays(librarySettingsService.getMaximumBorrowingPeriodForReferenceMaterials()).atStartOfDay());
            }
            if (bookType.equals("Giáo trình")) {
                //Nếu mượn sách quá giới hạn thì sẽ ném ra lỗi
                if (maxTextbooks < numberOfBorrowed + 1) throw new AppException(ErrorCode.BORROWING_MORE_THAN_ALLOWED);

                //Tính ngày phải trả của giáo trình
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
            }

            //Lưu dữ liệu bản ghi mượn sách
            borrowRecordRepository.save(borrowRecord);

            //Tạo mới bản ghi hoạt động gần đây
            RecentTransaction recentTransaction = new RecentTransaction();
            recentTransaction.setRecordID(borrowRecord.getRecordID());
            recentTransaction.setPatron(user.getFullName());
            recentTransaction.setAction("mượn sách");
            recentTransaction.setBookName(b.getBookName());
            recentTransaction.setTransactionTime(LocalDateTime.now());
            recentTransactionRepository.save(recentTransaction);
        }
        return APIResponse.builder()
                .code(1000)
                .message("Mượn sách thành công")
                .build();
    }

    @Transactional
    public APIResponse acceptBookReturn(String recordID){
        //Lấy thông tin thủ thư qua token
        String librarianID = SecurityContextHolder.getContext().getAuthentication().getName();
        if (librarianID == null) throw new AppException(ErrorCode.CAN_NOT_GET_USER_INFORMATION);
        User librarian = userRepository.findByUserID(librarianID).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        //Lấy thông tin bản ghi mượn sách qua mã mượn
        BorrowRecord borrowRecord = borrowRecordRepository.findByRecordID(recordID).orElseThrow(() -> new AppException(ErrorCode.CAN_NOT_FIND_BORROW_RECORD));

        //Lưu thông tin trả sách
        borrowRecord.setReturnApprovedBy(librarian);
        borrowRecord.setReturnDate(LocalDateTime.now());
        borrowRecordRepository.save(borrowRecord);

        //+1 cho số sách có sẵn
        Book b = borrowRecord.getBookID();
        b.setAvailableCopies(b.getAvailableCopies() + 1);
        bookRepository.save(b);
        String message;

        //Nếu trả muộn
        if (LocalDateTime.now().isAfter(borrowRecord.getDueDate())) {
            User user = borrowRecord.getUserID();
            long daysLate = ChronoUnit.DAYS.between(borrowRecord.getDueDate(), LocalDateTime.now());

            //Tạo bản ghi cho lỗi trả muộn
            UserViolation userViolation = new UserViolation();
            userViolation.setRecordID(borrowRecord);
            userViolation.setUserID(user);
            userViolation.setRecordedBy(librarian);
            userViolation.setViolationType("Trả sách muộn");
            userViolation.setDescription("Bạn đọc trả sách muộn " + daysLate + " ngày.");
            userViolation.setSolution("Nộp tiền phạt");
            int penaltyAmount;
            int pointsDeducted;

            //Phân biệt phí trả muộn và số điểm trừ khi trả muộn tài liệu tham khảo - Giáo trình
            if (borrowRecord.getBookID().getBookType().equals("Tài liệu tham khảo")){
                if (daysLate <= 30) penaltyAmount = (int)(librarySettingsService.getLateFeeMultiplier_ReferenceMaterials_Under30Days() * borrowRecord.getBookID().getPrice());
                else penaltyAmount = (int)(librarySettingsService.getLateFeeMultiplier_ReferenceMaterials_Over30Days() * borrowRecord.getBookID().getPrice());
                pointsDeducted = librarySettingsService.getPointsDeductedForLateReferenceMaterialsReturn();
            }
            else {
                if (LocalDateTime.now().isBefore(borrowRecord.getDueDate().plusMonths(3))) penaltyAmount = (int) (librarySettingsService.getLateFeeMultiplier_Textbook_Under3Months() * borrowRecord.getBookID().getPrice());
                else penaltyAmount = (int) (librarySettingsService.getLateFeeMultiplier_Textbook_Over3Months() * borrowRecord.getBookID().getPrice());
                System.out.println("Minh Minh phat" + penaltyAmount);
                pointsDeducted = librarySettingsService.getPointsDeductedForLateTextbookReturn();
                System.out.println("Minh Minh point" + pointsDeducted);
            }
            userViolation.setPenaltyAmount(BigDecimal.valueOf(penaltyAmount));
            userViolation.setPointsDeducted(pointsDeducted);
            userViolation.setViolationDate(LocalDateTime.now());
            System.out.println("Minh Minh date" + LocalDateTime.now());
            userViolationRepository.save(userViolation);
            System.out.println("Minh Minh dote" + LocalDateTime.now());
            //Điểm thành viên thấp nhất là 0, không co điểm âm
            if (user.getMemberPoints() - pointsDeducted > 0) user.setMemberPoints(user.getMemberPoints() - pointsDeducted);
            else user.setMemberPoints(0);
            userRepository.save(user);

            //Tạo bản ghi cho lịch sử điểm
            PointHistory pointHistory = new PointHistory();
            pointHistory.setUserID(user);
            pointHistory.setPoints(0 - pointsDeducted);
            System.out.println("Minh Minh" + pointsDeducted);
            pointHistory.setReason("Bạn đọc trả sách muộn " + daysLate + " ngày.");
            pointHistory.setUpdatedBy(librarian);
            pointHistory.setCreatedAt(LocalDateTime.now());
            pointHistoryRepository.save(pointHistory);
            message = "Trả sách thành công. Bạn đọc trả sách muộn " + daysLate + " ngày, nộp phạt " + penaltyAmount + "VND";
        }

        //Nếu trả sách đúng hạn
        else {
            User user = borrowRecord.getUserID();
            int pointBonus = librarySettingsService.getBonusPointsForOnTimeBookReturn();
            user.setMemberPoints(user.getMemberPoints() + pointBonus);
            userRepository.save(user);

            //Tạo bản ghi cho lịch sử điểm
            PointHistory pointHistory = new PointHistory();
            pointHistory.setUserID(user);
            pointHistory.setPoints(pointBonus);
            pointHistory.setReason("Bạn đọc trả sách đúng hạn.");
            pointHistory.setUpdatedBy(librarian);
            pointHistory.setCreatedAt(LocalDateTime.now());
            pointHistoryRepository.save(pointHistory);
            message = "Bạn đọc trả sách đúng hạn!";
        }

        //Chuyển đổi trạng thái cho sách
        BookItem bookItem = borrowRecord.getItemID();
        bookItem.setStatus("Có sẵn");
        bookItemRepository.save(bookItem);

        //Tạo mới bản ghi hoạt động gần đây
        RecentTransaction recentTransaction = new RecentTransaction();
        recentTransaction.setRecordID(borrowRecord.getRecordID());
        recentTransaction.setPatron(borrowRecord.getUserID().getFullName());
        recentTransaction.setAction("trả sách");
        recentTransaction.setBookName(b.getBookName());
        recentTransaction.setTransactionTime(LocalDateTime.now());
        recentTransactionRepository.save(recentTransaction);

        return APIResponse.builder().code(1000).message(message).build();
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

    //region Manage Violation
    public APIResponse<List<PatronViolationResponse>> getAllPatronViolations(){
        return APIResponse.<List<PatronViolationResponse>>builder()
                .code(1000)
                .result(userViolationRepository.getAllPatronViolations())
                .build();
    }

    public APIResponse<List<ViolationStatistic>> getMonthlyViolationCountByYear(int year){
        return APIResponse.<List<ViolationStatistic>>builder()
                .code(1000)
                .result(userViolationRepository.getMonthlyViolationCountByYear(year))
                .build();
    }

    public APIResponse<List<ViolationCountResponse>> getViolationCountByTypeThisYear(){
        return APIResponse.<List<ViolationCountResponse>>builder()
                .code(1000)
                .result(userViolationRepository.getViolationCountByTypeThisYear())
                .build();
    }

    public APIResponse<List<ViolationCountResponse>> getViolationCountByTypeThisQuarter(){
        return APIResponse.<List<ViolationCountResponse>>builder()
                .code(1000)
                .result(userViolationRepository.getViolationCountByTypeThisQuarter())
                .build();
    }

    public APIResponse<List<ViolationCountResponse>> getViolationCountByTypeThisMonth(){
        return APIResponse.<List<ViolationCountResponse>>builder()
                .code(1000)
                .result(userViolationRepository.getViolationCountByTypeThisMonth())
                .build();
    }
    public APIResponse<ViolationDetails> getUserViolationByViolationID(String violationID){
        UserViolation uv = userViolationRepository.findByViolationID(violationID);
        ViolationDetails result = new ViolationDetails();
        result.setViolationType(uv.getViolationType());
        result.setViolationDate(uv.getViolationDate());
        result.setDescription(uv.getDescription());
        result.setPenaltyAmount(uv.getPenaltyAmount());
        result.setPointsDeducted(uv.getPointsDeducted());
        result.setStaffName(uv.getRecordedBy().getFullName());

        User patron = uv.getUserID();
        edu.utc.demo_01.dto.librarian.response.PatronInformation pi = new edu.utc.demo_01.dto.librarian.response.PatronInformation();
        pi.setUserID(patron.getUserID());
        pi.setUserName(patron.getFullName());
        pi.setMemberPoints(patron.getMemberPoints());
        pi.setUserImage(patron.getUserImage());
        pi.setEmail(authCredentialRepository.findByUserID(patron).orElseThrow().getEmail());
        pi.setMembershipType(membershipRepository.findByUserID(patron).getMembershipType());
        result.setPatronInformation(pi);

        if (uv.getRecordID() != null) {
            BorrowRecord br = uv.getRecordID();
            BorrowRecordDetailsReponse brd = new BorrowRecordDetailsReponse();
            brd.setRecordID(br.getRecordID());
            brd.setBookName(br.getBookID().getBookName());
            brd.setBorrowDate(br.getBorrowDate());
            brd.setReturnDate(br.getReturnDate());
            brd.setDueDate(br.getDueDate());
            result.setBorrowRecordDetailsReponse(brd);
        }
        return APIResponse.<ViolationDetails>builder()
                .code(1000)
                .result(result)
                .build();
    }


    //endregion

    //region Manage Ticket
    public APIResponse<TicketStatistic> getTicketStatistic(){
        TicketStatistic ticketStatistic = new TicketStatistic();
        ticketStatistic.setTotalRequests(helpTicketRepository.countHelpTicket());
        ticketStatistic.setPending(helpTicketRepository.countByStatus("Đang chờ xử lý"));
        ticketStatistic.setProcessing(helpTicketRepository.countByStatus("Đang xử lý"));
        ticketStatistic.setCompleted(helpTicketRepository.countByStatus("Đã hoàn thành"));
        ticketStatistic.setRejected(helpTicketRepository.countByStatus("Bị từ chối"));

        return APIResponse.<TicketStatistic>builder()
                .code(1000)
                .result(ticketStatistic)
                .build();
    }

    public APIResponse<List<HelpTicketResponse>> getAllHelpTickets(){
        return APIResponse.<List<HelpTicketResponse>>builder()
                .code(1000)
                .result(helpTicketRepository.getAllHelpTickets())
                .build();
    }

    public APIResponse<HelpTicketResponseDetails> getHelpTicketDetail(String ticketID){
        return APIResponse.<HelpTicketResponseDetails>builder()
                .code(1000)
                .result(helpTicketRepository.getHelpTicketDetail(ticketID))
                .build();
    }

    public APIResponse<List<RespondDTO>> getListTicketResponse(String ticketID){
        return APIResponse.<List<RespondDTO>>builder()
                .code(1000)
                .result(ticketResponseRepository.findByTicketID(ticketID))
                .build();
    }
    @Transactional
    public APIResponse replyToSupportRequest(String ticketID, CreateTicketResponse request){
        String librarianID = SecurityContextHolder.getContext().getAuthentication().getName();
        if (librarianID == null) throw new AppException(ErrorCode.CAN_NOT_GET_USER_INFORMATION);
        User librarian = userRepository.findByUserID(librarianID).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        HelpTicket helpTicket = helpTicketRepository.findByTicketID(ticketID).orElseThrow(() -> new AppException(ErrorCode.CAN_NOT_FIND_TICKET));
        helpTicket.setStatus(request.getStatus());
        helpTicketRepository.save(helpTicket);

        TicketResponse ticketResponse = new TicketResponse();
        ticketResponse.setTicketID(helpTicket);
        ticketResponse.setStaffID(librarian);
        ticketResponse.setTitle(request.getTitle());
        ticketResponse.setResponseText(request.getMessage());
        ticketResponse.setCreatedAt(LocalDateTime.now());
        ticketResponseRepository.save(ticketResponse);
        return APIResponse.builder().code(1000).message("Phản hồi thành công").build();
    }
    //endregion
}

package edu.utc.demo_01.service;

import edu.utc.demo_01.dto.librarian.request.LendBookRequest;
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

import java.math.BigDecimal;
import java.time.Instant;
import java.time.temporal.ChronoUnit;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class LibrarianService {
    UserRepository userRepository;
    BookRepository bookRepository;
    BorrowRecordRepository borrowRecordRepository;
    UserViolationRepository userViolationRepository;
    UserAchievementRepository userAchievementRepository;

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
            UserAchievement userAchievement = new UserAchievement();
            userAchievement.setUserID(user);
            userAchievement.setAchievementType("Trả sách đúng hạn");
            userAchievement.setDescription("Trả sách đúng hạn");
            userAchievement.setPointsAwarded(5);
            userAchievement.setAwardedAt(Instant.now());
            userAchievementRepository.save(userAchievement);

            user.setMemberPoints(user.getMemberPoints() + 5);
            userRepository.save(user);
        }
        return true;
    }


}

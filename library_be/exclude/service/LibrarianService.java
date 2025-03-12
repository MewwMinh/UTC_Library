package edu.utc.demo_01.service;

import edu.utc.demo_01.dto.staff.librarian.request.BorrowBookRequest;
import edu.utc.demo_01.dto.staff.librarian.request.CreateEventRequest;
import edu.utc.demo_01.dto.staff.librarian.request.CreateViolationRequest;
import edu.utc.demo_01.dto.staff.librarian.response.EventParticipantReponse;
import edu.utc.demo_01.dto.staff.librarian.response.ViolationResponse;
import edu.utc.demo_01.enums.ViolationType;
import edu.utc.demo_01.repository.*;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;
import edu.utc.demo_01.enums.MembershipTier;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.List;


@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class LibrarianService {
    BorrowRecordRepository borrowRecordRepository;
    UserRepository userRepository;
    BookRepository bookRepository;
    MembershipRepository membershipRepository;
    ViolationHistoryRepository violationHistoryRepository;
    EventRepository eventRepository;
    EventParticipantRepository eventParticipantRepository;
    public boolean createBorrowRecord(BorrowBookRequest request) {
        BorrowRecord record = new BorrowRecord();
        record.setBookID(bookRepository.findById(request.getBookID()).orElseThrow());
        record.setUser(userRepository.findById(request.getUserID()).orElseThrow());
        record.setBorrowDate(Timestamp.valueOf(LocalDateTime.now()));
        String memberShiptier = membershipRepository.getMembershipTierByUserID(request.getUserID());
        int d;
        switch (memberShiptier) {
            case "ĐỒNG":
                d = 5;
                break;
            case "BẠC":
                d = 10;
                break;
            case "VÀNG":
                d = 15;
                break;
            default:
                d = 0;
                break;
        }
        record.setDueDate(Timestamp.valueOf(LocalDateTime.now().plusDays(d)));
        borrowRecordRepository.save(record);
        return true;
    }
    public boolean returnBook(BorrowBookRequest request) {
        String borrowRecordID = borrowRecordRepository.findBorrowRecordIDByBookIDAndUserID(request.getBookID(), request.getUserID()).orElseThrow();
        BorrowRecord borrowRecord = borrowRecordRepository.findById(borrowRecordID).orElseThrow();
        borrowRecord.setReturnDate(Timestamp.valueOf(LocalDateTime.now()));
        borrowRecordRepository.save(borrowRecord);
        return true;
    }
    public boolean createViolationRecord(CreateViolationRequest request) {
        ViolationHistory violation = new ViolationHistory();
        violation.setUserID(userRepository.findById(request.getUserID()).orElseThrow());
        violation.setRecordedBy(userRepository.findById(request.getStaffID()).orElseThrow());
        violation.setViolationType(ViolationType.valueOf(request.getViolationType()));
        if (request.getDescription() != null) violation.setDescription(request.getDescription());
        if (request.getPenaltyAmount() != null) violation.setPenaltyAmount(request.getPenaltyAmount());
        violation.setViolationDate(Timestamp.valueOf(LocalDateTime.now()));
        violationHistoryRepository.save(violation);
        return true;
    }
    public List<ViolationResponse> getAllViolations(){
        return violationHistoryRepository.getAllViolations();
    }
    public boolean createEvent(CreateEventRequest request){
        Event event = new Event();
        event.setTitle(request.getEventName());
        if (request.getDescription() != null) event.setDescription(request.getDescription());
        event.setStartTime(request.getStartTime());
        event.setEndTime(request.getEndTime());
        if (request.getLocation() != null) event.setLocation(request.getLocation());
        if (request.getCreateBy() != null) event.setCreatedBy(userRepository.findById(request.getCreateBy()).orElseThrow());
        eventRepository.save(event);
        return true;
    }
    public List<EventParticipantReponse> getParticipantByEventID(String id){
        return eventParticipantRepository.getEventParticipantByEventID(id);
    }
}

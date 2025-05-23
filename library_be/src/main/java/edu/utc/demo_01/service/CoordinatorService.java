package edu.utc.demo_01.service;

import edu.utc.demo_01.dto.APIResponse;
import edu.utc.demo_01.dto.coordinator.request.ChangeEventInformation;
import edu.utc.demo_01.dto.coordinator.request.ChangePatronInformation;
import edu.utc.demo_01.dto.coordinator.request.CreatePatron;
import edu.utc.demo_01.dto.coordinator.request.ResponseTicket;
import edu.utc.demo_01.dto.coordinator.response.*;
import edu.utc.demo_01.dto.patron.response.BorrowBookResponse2;
import edu.utc.demo_01.dto.patron.response.ViolationsResponse;
import edu.utc.demo_01.entity.*;
import edu.utc.demo_01.exception.AppException;
import edu.utc.demo_01.exception.ErrorCode;
import edu.utc.demo_01.repository.*;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class CoordinatorService {
    PasswordEncoder passwordEncoder;
    UserRepository userRepository;
    AuthCredentialRepository authCredentialRepository;
    UserRoleRepository userRoleRepository;
    RoleRepository roleRepository;
    MembershipRepository membershipRepository;
    BookRepository bookRepository;
    DDCClassificationRepository ddcRepository;
    BorrowRecordRepository borrowRecordRepository;
    BookReviewRepository bookReviewRepository;
    TicketResponseRepository ticketResponseRepository;
    HelpTicketRepository helpTicketRepository;
    UserViolationRepository userViolationRepository;
    ReadingRoomRecordRepository readingRoomRecordRepository;
    ActivityLogRepository activityLogRepository;
    EventRepository eventRepository;
    private final EventParticipantRepository eventParticipantRepository;

    public boolean responseTicket(ResponseTicket request) {
        TicketResponse ticketResponse = new TicketResponse();
        String userID = SecurityContextHolder.getContext().getAuthentication().getName();
        if (userID == null) throw new AppException(ErrorCode.CAN_NOT_GET_USER_INFORMATION);
        User coordinator = userRepository.findByUserID(userID).orElseThrow();
        ticketResponse.setTicketID(helpTicketRepository.findByTicketID(request.getTicketID()).orElseThrow(() -> new AppException(ErrorCode.CAN_NOT_FIND_TICKET)));
        ticketResponse.setStaffID(coordinator);
        ticketResponse.setTitle(request.getTitle());
        ticketResponse.setResponseText(request.getResponseText());
        ticketResponse.setCreatedAt(LocalDateTime.now());
        ticketResponseRepository.save(ticketResponse);
        return true;
    }

    //region Manage Reading Room
    public APIResponse<List<PatronInReadingRoom>> getPatronInReadingRoom() {
        List<ReadingRoomRecord> rrr = readingRoomRecordRepository.findAllActiveUsers();
        List<PatronInReadingRoom> patrons = new ArrayList<>();
        for (ReadingRoomRecord rr : rrr) {
            PatronInReadingRoom p = new PatronInReadingRoom();
            p.setRecordID(rr.getRecordID());
            p.setPatronID(rr.getUserID().getUserID());
            p.setPatronName(rr.getUserID().getFullName());
            p.setPatronImage(rr.getUserID().getUserImage());
            p.setCheckInTime(rr.getCheckInTime());
            p.setCheckInBy(rr.getCheckInBy().getFullName());
            patrons.add(p);
        }
        return APIResponse.<List<PatronInReadingRoom>>builder()
                .code(1000)
                .result(patrons)
                .build();
    }

    public APIResponse checkInPatron(String patronID) {
        String userID = SecurityContextHolder.getContext().getAuthentication().getName();
        if (userID == null) throw new AppException(ErrorCode.CAN_NOT_GET_USER_INFORMATION);
        User coordinator = userRepository.findByUserID(userID).orElseThrow();
        User patron = userRepository.findByUserID(patronID).orElseThrow();

        ReadingRoomRecord record = new ReadingRoomRecord();
        record.setUserID(patron);
        record.setCheckInTime(LocalDateTime.now());
        record.setCheckInBy(coordinator);
        readingRoomRecordRepository.save(record);

        return APIResponse.builder().code(1000).message("Check-in thành công").build();
    }

    public APIResponse checkOutPatron(String recordID) {
        String userID = SecurityContextHolder.getContext().getAuthentication().getName();
        if (userID == null) throw new AppException(ErrorCode.CAN_NOT_GET_USER_INFORMATION);
        User coordinator = userRepository.findByUserID(userID).orElseThrow();

        ReadingRoomRecord record = readingRoomRecordRepository.findByRecordID(recordID).orElseThrow();
        record.setCheckOutTime(LocalDateTime.now());
        record.setCheckOutBy(coordinator);
        readingRoomRecordRepository.save(record);

        return APIResponse.builder().code(1000).message("Check-out thành công").build();
    }
    //endregion

    //region Manage Patron
    public APIResponse<List<PatronResponse>> getAllPatrons() {
        return APIResponse.<List<PatronResponse>>builder()
                .code(1000)
                .result(userRepository.getAllPatrons())
                .build();
    }

    public APIResponse<PatronDetailsResponse> getPatronDetailsByUserID(String userID) {
        return APIResponse.<PatronDetailsResponse>builder()
                .code(1000)
                .result(userRepository.getPatronDetailsByUserID(userID))
                .build();
    }

    public APIResponse<List<BorrowBookResponse2>> getPatronBorrowRecordsHistory(String patronID) {
        return APIResponse.<List<BorrowBookResponse2>>builder()
                .code(1000)
                .result(borrowRecordRepository.getPatronBorrowRecordsHistory(patronID))
                .build();
    }

    public APIResponse<List<ViolationsResponse>> getPatronViolations(String patronID) {
        return APIResponse.<List<ViolationsResponse>>builder()
                .code(1000)
                .result(userViolationRepository.getPatronViolations(patronID))
                .build();
    }

    public APIResponse<List<UsingReadingRoomResponse>> getPatronUsingReadingRoomHistory  (String patronID) {
        User patron = userRepository.findByUserID(patronID).orElseThrow();
        List<ReadingRoomRecord> records = readingRoomRecordRepository.findReadingRoomRecordByUserIDOrderByCheckInTimeDesc(patron);
        List<UsingReadingRoomResponse> result = new ArrayList<>();
        for (ReadingRoomRecord record : records) {
            UsingReadingRoomResponse r = new UsingReadingRoomResponse();
            r.setCheckInTime(record.getCheckInTime());
            r.setCheckInBy(record.getCheckInBy().getFullName());
            if (record.getCheckOutTime() != null) {
                r.setCheckOutTime(record.getCheckOutTime());
                r.setCheckOutBy(record.getCheckOutBy().getFullName());
            }
            result.add(r);
        }
        return APIResponse.<List<UsingReadingRoomResponse>>builder()
                .code(1000)
                .result(result)
                .build();
    }

    @Transactional
    public APIResponse changePatronInformation(ChangePatronInformation request) {
        //Lấy thông tin người thực hiện hành động
        String coordinatorID = SecurityContextHolder.getContext().getAuthentication().getName();
        if (coordinatorID == null) throw new AppException(ErrorCode.CAN_NOT_GET_USER_INFORMATION);
        User coordinator = userRepository.findByUserID(coordinatorID).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
        UserRole ur = userRoleRepository.findByUser(coordinator).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        //Lấy thông tin bạn đọc
        User patron = userRepository.findByUserID(request.getUserID()).orElseThrow();
        UserRole patronRole = userRoleRepository.findByUser(patron).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        //Ghi log
        ActivityLog activityLog = new ActivityLog();
        activityLog.setActorID(coordinator);
        activityLog.setActorRole(ur.getRole().getRoleName());
        activityLog.setActionType("Cập nhật");
        activityLog.setEntityType("Patron");
        activityLog.setEntityID(patron.getUserID());
        activityLog.setActionTime(LocalDateTime.now());
        activityLog.setStatus("Thành công");

        String actionDetails = "";

        if (!request.getFullName().equals(patron.getFullName()))
        {
            actionDetails += "Thay đổi tên từ " + patron.getFullName() + " thành " + request.getFullName() + "\n";
            patron.setFullName(request.getFullName());
        }

        if (!request.getStatus().equals(patron.getStatus()))
        {
            actionDetails += "Thay đổi trạng thái từ " + patron.getStatus() + " thành " + request.getStatus() + "\n";
            patron.setStatus(request.getStatus());
        }

        if (!request.getDob().equals(patron.getDob()))
        {
            actionDetails += "Thay đổi ngày tháng năm sinh từ " + patron.getDob() + " thành " + request.getDob() + "\n";
            patron.setDob(request.getDob());
        }

        if (!request.getGender().equals(patron.getGender()))
        {
            actionDetails += "Thay đổi giới tính từ " + patron.getGender() + " thành " + request.getGender() + "\n";
            patron.setGender(request.getGender());
        }

        if (request.getPlusDays() != null)
        {
            actionDetails += "Cập nhật hạn sử dụng của tài khoản tăng " + request.getPlusDays() + " ngày\n";
            patron.setExpiry(patron.getExpiry().plusDays(request.getPlusDays()));
        }

        if (!request.getMemberPoints().equals(patron.getMemberPoints()))
        {
            actionDetails += "Thay đổi điểm thành viên từ " + patron.getMemberPoints() + " thành " + request.getMemberPoints() + "\n";
            patron.setMemberPoints(request.getMemberPoints());
        }

        if (!request.getRole().equals(patronRole.getRole().getRoleName()))
        {
            actionDetails += "Thay đổi vai trò từ " + patronRole.getRole().getRoleName() + " thành " + request.getRole() + "\n";
            patronRole.setRole(roleRepository.findByRoleName(request.getRole()));
            userRoleRepository.save(patronRole);
        }

        userRepository.save(patron);

        activityLog.setActionDetails(actionDetails);
        activityLogRepository.save(activityLog);

        return APIResponse.builder()
                .code(1000)
                .message("Thay đổi thông tin bạn đọc thành công!!")
                .build();
    }

    @Transactional
    public APIResponse createPatron(CreatePatron request) {
        //Lấy thông tin người thực hiện hành động
        String coordinatorID = SecurityContextHolder.getContext().getAuthentication().getName();
        if (coordinatorID == null) throw new AppException(ErrorCode.CAN_NOT_GET_USER_INFORMATION);
        User coordinator = userRepository.findByUserID(coordinatorID).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        if (userRepository.existsByUserID(request.getUserID())) throw new AppException(ErrorCode.USER_ID_EXIST);
        if (authCredentialRepository.existsByEmail(request.getEmail())) throw new AppException(ErrorCode.EMAIL_EXIST);

        User user = new User();
        user.setUserID(request.getUserID());
        user.setFullName(request.getFullName());
        user.setUserType("Patron");
        user.setStatus("Hoạt động");
        user.setCreatedAt(LocalDate.now());
        if (request.getDob() != null) user.setDob(request.getDob());
        user.setGender(request.getGender());
        user.setExpiry(LocalDate.now().plusMonths(6));
        user.setMemberPoints(0);
        if (request.getUserImage() != null) user.setUserImage(request.getUserImage());
        if (request.getNationalID() != null) user.setNationalID(request.getNationalID());
        user =  userRepository.save(user);

        AuthCredential authCredential = new AuthCredential();
        authCredential.setUserID(user);
        authCredential.setEmail(request.getEmail());
        authCredential.setPasswordHash(passwordEncoder.encode("123456"));
        authCredential.setLastLogin(LocalDateTime.now());
        authCredentialRepository.save(authCredential);

        Role role = roleRepository.findByRoleName("PATRON");
        UserRole userRole = new UserRole();
        userRole.setUser(user);
        userRole.setRole(role);
        userRole.setAssignedAt(LocalDateTime.now());
        userRoleRepository.save(userRole);

        Membership membership = new Membership();
        membership.setUserID(user);
        membership.setMembershipType("Đồng");
        membership.setUpdateBy(coordinator);
        membership.setUpdatedAt(Instant.now());
        membershipRepository.save(membership);

        //Ghi log
        ActivityLog activityLog = new ActivityLog();
        activityLog.setActorID(coordinator);
        activityLog.setActorRole(role.getRoleName());
        activityLog.setActionType("Tạo mới");
        activityLog.setEntityType("Patron");
        activityLog.setEntityID(user.getUserID());
        activityLog.setActionDetails("Tạo mới bạn đọc " + user.getFullName());
        activityLog.setActionTime(LocalDateTime.now());
        activityLog.setStatus("Thành công");
        activityLogRepository.save(activityLog);

        return APIResponse.builder()
                .code(1000)
                .message("Tạo mới bạn đọc thành công!!")
                .build();
    }

    public boolean resetPatronPassword(String patronID) {
        User user = userRepository.findByUserID(patronID).orElseThrow(() -> new AppException(ErrorCode.CAN_NOT_GET_USER_INFORMATION));
        AuthCredential credential = authCredentialRepository.findByUserID(user).orElseThrow(() -> new AppException(ErrorCode.CAN_NOT_GET_USER_INFORMATION));
        credential.setPasswordHash(passwordEncoder.encode("123456"));
        authCredentialRepository.save(credential);
        return true;
    }
    //endregion

    //region Manage Event
    public APIResponse<List<EventResponse>> getAllEvents() {
        return APIResponse.<List<EventResponse>>builder()
                .code(1000)
                .result(eventRepository.getEvents())
                .build();
    }

    public APIResponse<EventResponse> getEventByEventID(String eventID) {
        return APIResponse.<EventResponse>builder()
                .code(1000)
                .result(eventRepository.getEventByEventID(eventID))
                .build();
    }

    @Transactional
    public APIResponse changeEventInfomation(String eventID, ChangeEventInformation request) {
        String userID = SecurityContextHolder.getContext().getAuthentication().getName();
        if (userID == null) throw new AppException(ErrorCode.CAN_NOT_GET_USER_INFORMATION);
        User coordinator = userRepository.findByUserID(userID).orElseThrow();
        UserRole userRole = userRoleRepository.findByUser(coordinator).orElseThrow();

        String actionDetails = "";

        Event event = eventRepository.findByEventID(eventID).orElseThrow(() -> new AppException(ErrorCode.CAN_NOT_FIND_EVENT));

        if (!request.getTitle().equals(event.getTitle())){
            actionDetails += "Thay đổi tiêu đề sự kiện từ " + event.getTitle() + " thành " + request.getTitle() + "\n";
            event.setTitle(request.getTitle());
        }

        if (!request.getDescription().equals(event.getDescription())) {
            actionDetails += "Thay đổi chi tiết sự kiện từ " + event.getDescription() + " thành " + request.getDescription() + "\n";
            event.setDescription(request.getDescription());
        }

        if (!request.getStartTime().equals(event.getStartTime())) {
            actionDetails += "Thay đổi thời gian bắt đầu từ " + event.getStartTime() + " thành " + request.getStartTime() + "\n";
            event.setStartTime(request.getStartTime());
        }

        if (!request.getEndTime().equals(event.getEndTime())) {
            actionDetails += "Thay đổi thời gian kết thúc từ " + event.getEndTime() + " thành " + request.getEndTime() + "\n";
            event.setEndTime(request.getEndTime());
        }

        if (!request.getLocation().equals(event.getLocation())) {
            actionDetails += "Thay đổi địa điểm từ " + event.getLocation() + " thành " + request.getLocation() + "\n";
            event.setLocation(request.getLocation());
        }

        if (!request.getMaxAttendees().equals(event.getMaxAttendees())) {
            actionDetails += "Thay đổi số lượng người tham dự tối đa từ " + event.getMaxAttendees() + " thành " + request.getMaxAttendees() + "\n";
            event.setMaxAttendees(request.getMaxAttendees());
        }

        event.setCreatedBy(coordinator);
        eventRepository.save(event);

        //Ghi log
        ActivityLog activityLog = new ActivityLog();
        activityLog.setActorID(coordinator);
        activityLog.setActorRole(userRole.getRole().getRoleName());
        activityLog.setActionType("Cập nhật");
        activityLog.setEntityType("Event");
        activityLog.setEntityID(eventID);
        activityLog.setActionDetails(actionDetails);
        activityLog.setActionTime(LocalDateTime.now());
        activityLog.setStatus("Thành công");
        activityLogRepository.save(activityLog);

        return APIResponse.builder()
                .code(1000)
                .message("Sửa đổi thông tin cho sự kiện " + event.getTitle() + " thành công !!")
                .build();
    }

    public APIResponse deleteEventByEventID(String eventID) {
        eventRepository.delete(eventRepository.findByEventID(eventID).orElseThrow(() -> new AppException(ErrorCode.CAN_NOT_FIND_EVENT)));
        return APIResponse.builder()
                .code(1000)
                .message("Xóa thành công sự kiện!!")
                .build();
    }

    @Transactional
    public APIResponse createEvent(ChangeEventInformation request) {
        String userID = SecurityContextHolder.getContext().getAuthentication().getName();
        if (userID == null) throw new AppException(ErrorCode.CAN_NOT_GET_USER_INFORMATION);
        User coordinator = userRepository.findByUserID(userID).orElseThrow();
        UserRole userRole = userRoleRepository.findByUser(coordinator).orElseThrow();

        Event event = new Event();
        event.setTitle(request.getTitle());
        if (request.getDescription() != null) event.setDescription(request.getDescription());
        event.setStartTime(request.getStartTime());
        event.setEndTime(request.getEndTime());
        if (request.getLocation() != null) event.setLocation(request.getLocation());
        event.setMaxAttendees(request.getMaxAttendees());
        event.setCreatedBy(coordinator);
        eventRepository.save(event);

        //Ghi log
        ActivityLog activityLog = new ActivityLog();
        activityLog.setActorID(coordinator);
        activityLog.setActorRole(userRole.getRole().getRoleName());
        activityLog.setActionType("Tạo mới");
        activityLog.setEntityType("Event");
        activityLog.setEntityID(event.getEventID());
        activityLog.setActionDetails("Tao mới sự kiện " + event.getTitle());
        activityLog.setActionTime(LocalDateTime.now());
        activityLog.setStatus("Thành công");
        activityLogRepository.save(activityLog);

        return APIResponse.builder()
                .code(1000)
                .message("Tao mới sự kiện " + event.getTitle() + " thành công!!")
                .build();
    }

    public APIResponse<List<PatronRegisted>> getAllPatronRegisted(String eventID) {
        Event event = eventRepository.findByEventID(eventID).orElseThrow(() -> new AppException(ErrorCode.CAN_NOT_FIND_EVENT));
        List<EventParticipant> eventParticipants = eventParticipantRepository.findByEventID(event);
        List<PatronRegisted> patronRegisteds = new ArrayList<>();
        for (EventParticipant eventParticipant : eventParticipants) {
            PatronRegisted p = new PatronRegisted();
            p.setPatronID(eventParticipant.getUserID().getUserID());
            p.setPatronName(eventParticipant.getUserID().getFullName());
            p.setAttendanceStatus(eventParticipant.getAttendanceStatus());
            p.setRegisterTime(eventParticipant.getRegistrationDate());
            patronRegisteds.add(p);
        }
        return APIResponse.<List<PatronRegisted>>builder()
                .code(1000)
                .result(patronRegisteds)
                .build();
    }

    //endregion
}

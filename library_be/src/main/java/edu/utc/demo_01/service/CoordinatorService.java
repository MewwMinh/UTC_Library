package edu.utc.demo_01.service;

import edu.utc.demo_01.dto.coordinator.request.CreatePatron;
import edu.utc.demo_01.dto.coordinator.request.ResponseTicket;
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
    @Transactional
    public boolean createPatron(CreatePatron request) {
        User user = new User();
        user.setUserID(request.getUserID());
        user.setFullName(request.getFullName());
        user.setUserType(request.getUserType());
        user.setStatus("ACTIVE");
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
        authCredential.setLastLogin(Instant.now());
        authCredentialRepository.save(authCredential);

        Role role = roleRepository.findByRoleName("Patron");
        UserRole userRole = new UserRole();
        userRole.setUser(user);
        userRole.setRole(role);
        userRole.setAssignedAt(Instant.now());
        userRoleRepository.save(userRole);

        Membership membership = new Membership();
        membership.setUserID(user);
        membership.setMembershipType("Đồng");
        membership.setUpdateBy(userRepository.findByUserID(request.getStaffID()).orElseThrow(() -> new AppException(ErrorCode.CAN_NOT_GET_USER_INFORMATION)));
        membership.setUpdatedAt(Instant.now());
        membershipRepository.save(membership);
        return true;
    }
    public boolean resetPatronPassword(String patronID) {
        User user = userRepository.findByUserID(patronID).orElseThrow(() -> new AppException(ErrorCode.CAN_NOT_GET_USER_INFORMATION));
        AuthCredential credential = authCredentialRepository.findByUserID(user).orElseThrow(() -> new AppException(ErrorCode.CAN_NOT_GET_USER_INFORMATION));
        credential.setPasswordHash(passwordEncoder.encode("123456"));
        authCredentialRepository.save(credential);
        return true;
    }
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
}

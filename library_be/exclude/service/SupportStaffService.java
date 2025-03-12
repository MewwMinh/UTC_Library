package edu.utc.demo_01.service;

import edu.utc.demo_01.dto.staff.support_staff.reponse.ChangeMembershipTierResponse;
import edu.utc.demo_01.dto.staff.support_staff.reponse.UserRequestDetailResponse;
import edu.utc.demo_01.dto.staff.support_staff.reponse.UserRequestResponse;
import edu.utc.demo_01.dto.staff.support_staff.reponse.UserResponse;
import edu.utc.demo_01.dto.staff.support_staff.request.ChangeMembershipTierRequest;
import edu.utc.demo_01.dto.staff.support_staff.request.CreateResponseRequest;
import edu.utc.demo_01.dto.staff.support_staff.request.CreateUserRequest;
import edu.utc.demo_01.enums.MembershipTier;
import edu.utc.demo_01.enums.RequestStatus;
import edu.utc.demo_01.enums.UserType;
import edu.utc.demo_01.repository.*;
import jakarta.transaction.Transactional;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class SupportStaffService {
    CategoryRepository categoryRepository;
    BookRepository bookRepository;
    UserRepository userRepository;
    MembershipRepository membershipRepository;
    AuthCredentialRepository authCredentialRepository;
    UTCDatabaseRepository databaseRepository;
    RoleRepository roleRepository;
    UserRoleRepository userRoleRepository;
    SupportRequestRepository supportRequestRepository;
    SupportResponseRepository supportResponseRepository;

    public Category createCategory(Category category) {
        return categoryRepository.save(category);
    }

    public Book createBook(Book book) {
        return bookRepository.save(book);
    }

    public List<UserResponse> getAllUsers() {
        return userRepository.getAllUsers();
    }

    public ChangeMembershipTierResponse changeMembershipTier(ChangeMembershipTierRequest request){
        ChangeMembershipTierResponse response = new ChangeMembershipTierResponse();
        User user = userRepository.findById(request.getUserId()).orElseThrow();
        response.setFullName(user.getFullName());

        Membership membership = membershipRepository.findByUserID(user).orElseThrow();
        response.setOldMembershipTier(membership.getMembershipType().toString());
        response.setNewMembershipTier(request.getNewMembershipTier());

        membership.setMembershipType(MembershipTier.valueOf(request.getNewMembershipTier()));
        membershipRepository.save(membership);
        return response;
    }

    public String resetUserPassword(String id){
        User user = userRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("User with id " + id + " not found"));
        AuthCredential credential = authCredentialRepository.findByUser(user).orElseThrow();
        credential.setPasswordHash("<PASSWORD>");
        authCredentialRepository.save(credential);
        return "OK";
    }

    public boolean createUserInUTC(String id){
        UTCDatabase data = databaseRepository.findById(id).orElseThrow();

        User user = new User();
        user.setFullName(data.getUserName());
        user.setUserType(UserType.USER);
        user = userRepository.save(user);

        Membership membership = new Membership();
        membership.setUserID(user);
        membership.setMembershipType(MembershipTier.ĐỒNG);
        membershipRepository.save(membership);

        AuthCredential authCredential = new AuthCredential();
        authCredential.setUser(user);
        authCredential.setPasswordHash(data.getUserID());
        authCredential.setEmail(data.getEmail());
        authCredentialRepository.save(authCredential);

        UserRole userRole = new UserRole();
        userRole.setUser(user);
        userRole.setRole(roleRepository.findByRoleName(data.getRoleName()));
        userRoleRepository.save(userRole);
        return true;
    }

    public boolean createUser(CreateUserRequest request){
        User user = new User();
        user.setFullName(request.getFullName());
        user.setUserType(UserType.USER);
        user = userRepository.save(user);
        Membership membership = new Membership();
        membership.setUserID(user);
        membership.setMembershipType(MembershipTier.ĐỒNG);
        membershipRepository.save(membership);
        AuthCredential authCredential = new AuthCredential();
        authCredential.setUser(user);
        authCredential.setPasswordHash("123");
        authCredential.setEmail(request.getEmail());
        authCredentialRepository.save(authCredential);
        UserRole userRole = new UserRole();
        userRole.setUser(user);
        userRole.setRole(roleRepository.findByRoleName(request.getRoleName()));
        userRoleRepository.save(userRole);
        return true;
    }

    public List<UserRequestResponse> getAllUserRequests() {
        return supportRequestRepository.findAllRequests();
    }

    public UserRequestDetailResponse getSupportRequestDetail(String id) {
        return supportRequestRepository.findByRequestID(id);
    }

    @Transactional
    public boolean responseUserRequest(CreateResponseRequest request){
        SupportResponse response = new SupportResponse();
        SupportRequest supportRequest = supportRequestRepository.findById(request.getRequestID()).orElseThrow();
        response.setRequestID(supportRequest);
        response.setStaffID(userRepository.findById(request.getStaffID()).orElseThrow());
        response.setResponseText(request.getResponseText());
        response.setCreatedAt(Timestamp.valueOf(LocalDateTime.now()));
        supportResponseRepository.save(response);
        supportRequest.setStatus(RequestStatus.RESOLVED);
        supportRequestRepository.save(supportRequest);
        return true;
    }
}

package edu.utc.demo_01.service;

import com.github.javafaker.Faker;
import edu.utc.demo_01.dto.admin.request.CreateStaffRequest;
import edu.utc.demo_01.dto.admin.request.SetStaffStatusRequest;
import edu.utc.demo_01.dto.admin.response.*;
import edu.utc.demo_01.enums.UserStatus;
import edu.utc.demo_01.enums.UserType;
import edu.utc.demo_01.repository.*;
import jakarta.annotation.PostConstruct;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Random;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AdminService {
    UserRepository userRepository;
    AuthCredentialRepository authCredentialRepository;
    UserRoleRepository userRoleRepository;
    RoleRepository roleRepository;
    MembershipRepository membershipRepository;
    BookRepository bookRepository;
    BorrowRecordRepository borrowRecordRepository;
    Faker faker = new Faker();
    UTCDatabaseRepository databaseRepository;

    @Transactional
    public boolean createStaff(CreateStaffRequest request){
        User user = new User();
        user.setFullName(request.getFullName());
        user.setUserType(UserType.STAFF);
        user = userRepository.save(user);

        AuthCredential credential = new AuthCredential();
        credential.setUser(user);
        credential.setEmail(request.getEmail());
        credential.setPasswordHash(request.getPassword());
        authCredentialRepository.save(credential);

        Role role = roleRepository.findByRoleName(request.getRoleName());

        UserRole userRole = new UserRole();
        userRole.setUser(user);
        userRole.setRole(role);
        userRoleRepository.save(userRole);

        return true;
    }

    public boolean setStaffStatus(SetStaffStatusRequest request){
        User user = userRepository.findById(request.getStaffID()).orElseThrow();
        user.setUserStatus(UserStatus.valueOf(request.getStatus()));
        userRepository.save(user);
        return true;
    }

    public String resetStaffPassword(String id){
        User user = userRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("User with id " + id + " not found"));
        AuthCredential credential = authCredentialRepository.findByUser(user).orElseThrow();
        credential.setPasswordHash("<PASSWORD>");
        authCredentialRepository.save(credential);
        return "OK";
    }

    public List<StaffReponse> getAllStaff(){
        return userRepository.getAllStaff();
    }

    public QuantityOfUserByMembershipTier getQuantityOfUserByMembershipTier(){
        return membershipRepository.getQuantityOfUserByMembershipTier();
    }

    public QuantityOfUserByRole getQuantityOfUserByRole(){
        return userRoleRepository.getQuantityOfUserByRole();
    }

    public QuantityUsersReponse getQuantityUsersSTT(){
        return userRepository.getQuantityUsersReponse();
    }

    public QuantityOfBook getQuantityOfBook(){
        return bookRepository.bookQuantity();
    }

    public QuantityOfOverDueBook getQuantityOfOverDueBook(){
        return borrowRecordRepository.getQuantityOfOverDueBookByTime();
    }

    @PostConstruct
    public void generateData() {
        if (databaseRepository.count() >= 100) {
            System.out.println("Database already has enough records. Skipping data generation.");
            return;
        }
        String[] roles = {"Teacher", "Student", "Researcher"};
        Random random = new Random();
        List<UTCDatabase> users = new ArrayList<>();
        for (int i = 0; i < 100; i++) {
            UTCDatabase user = UTCDatabase.builder()
                    .userID(String.format("U%08d", i + 1)) // UserID dạng U00000001
                    .userName(faker.name().fullName())
                    .email(faker.internet().emailAddress())
                    .roleName(roles[random.nextInt(roles.length)]) // Chọn random "Teacher", "Student" hoặc "Researcher"
                    .build();
            users.add(user);
        }

        databaseRepository.saveAll(users);
        System.out.println("Generated 100 fake records successfully!");
    }
}

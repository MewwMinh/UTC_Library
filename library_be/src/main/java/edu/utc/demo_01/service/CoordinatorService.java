package edu.utc.demo_01.service;

import com.github.javafaker.Faker;
import edu.utc.demo_01.dto.coordinator.request.CreatePatron;
import edu.utc.demo_01.entity.*;
import edu.utc.demo_01.exception.AppException;
import edu.utc.demo_01.exception.ErrorCode;
import edu.utc.demo_01.repository.*;
import jakarta.annotation.PostConstruct;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.LocalDate;
import java.util.Random;

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

    private final Faker faker = new Faker();
    private final Random random = new Random();
    private final String[] formats = {"14,5 cm x 20,5 cm", "16 cm x 24 cm", "A4", "A5"};

    @PostConstruct
    public void generateFakeBooks() {
        if (bookRepository.count() == 0) {
            System.out.println("📚 Đang tạo dữ liệu sách giả lập...");
            for (int i = 0; i < 50; i++) {
                Book book = new Book();
                book.setBookName(faker.book().title());
                book.setAuthor(faker.book().author());
                book.setBookType(random.nextBoolean() ? "Giáo trình" : "Tham khảo");
                book.setIsbn(faker.number().digits(13));
                book.setTotalCopies(random.nextInt(10, 50));
                book.setAvailableCopies(random.nextInt(1, book.getTotalCopies()));
                book.setPublicationYear(random.nextInt(1980, 2025));
                book.setLanguage(random.nextBoolean() ? "Tiếng Việt" : "English");
                book.setPageCount(random.nextInt(100, 1000));
                book.setFormat(formats[random.nextInt(formats.length)]);
                book.setDescription(faker.lorem().sentence());
                book.setCoverImage("https://via.placeholder.com/150");

                // Lấy một DDCCode ngẫu nhiên từ bảng DDCClassification
                book.setDDCCode(ddcRepository.findRandomDDC());

                bookRepository.save(book);
            }
            System.out.println("✅ Hoàn tất tạo dữ liệu sách!");
        }
    }
}

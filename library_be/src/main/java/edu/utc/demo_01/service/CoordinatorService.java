package edu.utc.demo_01.service;

import com.github.javafaker.Faker;
import edu.utc.demo_01.dto.coordinator.request.CreatePatron;
import edu.utc.demo_01.dto.coordinator.request.ResponseTicket;
import edu.utc.demo_01.entity.*;
import edu.utc.demo_01.exception.AppException;
import edu.utc.demo_01.exception.ErrorCode;
import edu.utc.demo_01.repository.*;
import jakarta.annotation.PostConstruct;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.concurrent.TimeUnit;

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
        ticketResponse.setCreatedAt(Instant.now());
        ticketResponseRepository.save(ticketResponse);
        return true;
    }
    //regionFakeData
    private final Faker faker = new Faker();
    private final Random random = new Random();
    private final String[] formats = {"14,5 cm x 20,5 cm", "16 cm x 24 cm", "A4", "A5"};

    @PostConstruct
    public void generateFakeBooks() {
        if (bookRepository.count() <= 100) {
            System.out.println("📚 Đang tạo dữ liệu sách giả lập...");

            // Danh sách tên sách thực tế theo chủ đề
            Map<String, List<String>> bookTitlesByTopic = new HashMap<>();

            // Lập trình Java
            bookTitlesByTopic.put("Lập trình Java", List.of(
                    "Java Core - Nền tảng lập trình hiện đại",
                    "Lập trình hướng đối tượng với Java",
                    "Java Spring Boot - Xây dựng ứng dụng enterprise",
                    "Java Design Patterns - Các mẫu thiết kế phần mềm",
                    "Lập trình đa luồng và bất đồng bộ trong Java",
                    "Java và Microservices - Kiến trúc phân tán hiện đại",
                    "Phát triển ứng dụng web với Java Servlet và JSP",
                    "Hibernate và JPA - Thao tác với cơ sở dữ liệu trong Java",
                    "Bảo mật ứng dụng Java - Nguyên lý và thực hành",
                    "Xây dựng RESTful API với Java Spring"
            ));

            // Trí tuệ nhân tạo
            bookTitlesByTopic.put("Trí tuệ nhân tạo", List.of(
                    "Nhập môn Trí tuệ nhân tạo và Học máy",
                    "Deep Learning - Lý thuyết và ứng dụng",
                    "Xử lý ngôn ngữ tự nhiên với Python và TensorFlow",
                    "Computer Vision - Nhận diện và phân tích hình ảnh",
                    "Reinforcement Learning - Học tăng cường và ứng dụng",
                    "Trí tuệ nhân tạo trong phân tích dữ liệu lớn",
                    "Học máy cho người mới bắt đầu",
                    "Neural Networks - Mạng nơ-ron và ứng dụng thực tiễn",
                    "AI và đạo đức - Những thách thức của công nghệ thông minh",
                    "Trí tuệ nhân tạo ứng dụng trong y tế và chẩn đoán"
            ));

            // Hệ thống nhúng
            bookTitlesByTopic.put("Hệ thống nhúng", List.of(
                    "Lập trình Vi điều khiển với Arduino",
                    "Thiết kế và phát triển hệ thống IoT",
                    "Hệ thống nhúng thời gian thực với RTOS",
                    "Lập trình Raspberry Pi cho IoT và automation",
                    "Thiết kế mạch điện tử cho hệ thống nhúng",
                    "Hệ thống nhúng và cảm biến thông minh",
                    "Phát triển ứng dụng nhúng với Linux",
                    "Thiết kế hệ thống nhúng tiết kiệm năng lượng",
                    "Giao tiếp trong hệ thống IoT - Các giao thức và chuẩn",
                    "Bảo mật cho hệ thống IoT và thiết bị nhúng"
            ));

            // Phát triển web
            bookTitlesByTopic.put("Phát triển web", List.of(
                    "Phát triển web Full-Stack với MERN",
                    "Lập trình Frontend hiện đại với React và Redux",
                    "Angular - Framework toàn diện cho ứng dụng web",
                    "Node.js - Xây dựng ứng dụng server-side hiệu năng cao",
                    "Responsive Web Design - Thiết kế web đáp ứng",
                    "Progressive Web Apps - Tương lai của web application",
                    "CSS nâng cao và SASS/SCSS",
                    "API RESTful - Thiết kế và phát triển",
                    "TypeScript - JavaScript mạnh mẽ với kiểu dữ liệu tĩnh",
                    "Web Performance Optimization - Tối ưu hiệu suất ứng dụng web"
            ));

            // Bảo mật thông tin
            bookTitlesByTopic.put("Bảo mật thông tin", List.of(
                    "Bảo mật mạng và hệ thống thông tin",
                    "Ethical Hacking - Kỹ thuật tấn công và phòng thủ",
                    "Mật mã học ứng dụng trong bảo mật dữ liệu",
                    "Phân tích và phòng chống mã độc",
                    "Bảo mật ứng dụng web - OWASP Top 10",
                    "Điều tra số và phân tích dữ liệu pháp lý",
                    "Zero Trust Security - Mô hình bảo mật không tin tưởng",
                    "Bảo mật Cloud và Container",
                    "DevSecOps - Tích hợp bảo mật vào quy trình phát triển",
                    "Quản lý rủi ro và tuân thủ an ninh thông tin"
            ));

            // Khoa học dữ liệu
            bookTitlesByTopic.put("Khoa học dữ liệu", List.of(
                    "Python cho Khoa học dữ liệu và Phân tích",
                    "Khai phá dữ liệu - Nguyên lý và kỹ thuật",
                    "Trực quan hóa dữ liệu với D3.js và Matplotlib",
                    "Big Data Analytics với Hadoop và Spark",
                    "Thống kê và xác suất cho Khoa học dữ liệu",
                    "Machine Learning trong phân tích dữ liệu",
                    "Data Wrangling - Xử lý và chuẩn bị dữ liệu",
                    "SQL và NoSQL - Quản lý và truy vấn dữ liệu lớn",
                    "Dự báo và phân tích chuỗi thời gian",
                    "Phân tích dữ liệu xã hội và khai thác ý kiến"
            ));

            // Quản lý dự án phần mềm
            bookTitlesByTopic.put("Quản lý dự án phần mềm", List.of(
                    "Phương pháp Agile trong phát triển phần mềm",
                    "Scrum - Framework cho quản lý dự án linh hoạt",
                    "DevOps - Kết hợp phát triển và vận hành",
                    "Quản lý dự án phần mềm theo chuẩn PMI",
                    "Ước lượng và lập kế hoạch dự án phần mềm",
                    "Lean Software Development - Phát triển tinh gọn",
                    "Quản lý rủi ro trong dự án CNTT",
                    "Kanban - Quản lý luồng công việc hiệu quả",
                    "Product Owner - Vai trò và kỹ năng trong Agile",
                    "Continuous Integration & Continuous Delivery"
            ));

            // Cấu trúc dữ liệu và Giải thuật
            bookTitlesByTopic.put("Cấu trúc dữ liệu và Giải thuật", List.of(
                    "Cấu trúc dữ liệu và giải thuật cơ bản",
                    "Phân tích và thiết kế thuật toán",
                    "Lập trình động và backtracking",
                    "Thuật toán tìm kiếm và sắp xếp nâng cao",
                    "Cấu trúc dữ liệu đồ thị và ứng dụng",
                    "Cây nhị phân tìm kiếm và cây cân bằng",
                    "Thuật toán tham lam và quy hoạch động",
                    "Giải thuật xử lý chuỗi và pattern matching",
                    "Cấu trúc dữ liệu cho Big Data",
                    "Thuật toán song song và phân tán"
            ));

            // Hệ điều hành
            bookTitlesByTopic.put("Hệ điều hành", List.of(
                    "Nguyên lý hệ điều hành hiện đại",
                    "Linux/UNIX - Quản trị hệ thống",
                    "Lập trình Shell và Scripting",
                    "Quản lý bộ nhớ và tiến trình trong hệ điều hành",
                    "Hệ điều hành thời gian thực",
                    "Ảo hóa và Container trong hệ thống hiện đại",
                    "Hệ điều hành nhúng và IoT",
                    "Windows Server - Quản trị và cấu hình",
                    "Lập trình hệ thống với C/C++",
                    "Cloud OS và Distributed Operating Systems"
            ));

            // Mạng máy tính
            bookTitlesByTopic.put("Mạng máy tính", List.of(
                    "Nguyên lý và giao thức mạng máy tính",
                    "Bảo mật mạng doanh nghiệp",
                    "Mạng không dây và di động",
                    "Cloud Computing và Virtualization",
                    "Software-Defined Networking",
                    "Thiết kế và triển khai mạng Cisco",
                    "IPv6 - Giao thức Internet thế hệ mới",
                    "Mạng 5G và ứng dụng",
                    "Quản trị mạng doanh nghiệp quy mô lớn",
                    "VoIP và Unified Communications"
            ));

            List<String> degrees = List.of("TS.", "ThS.", "GS.", "PGS.TS.");

            // Danh sách nhà xuất bản
            List<String> publishers = List.of(
                    "NXB Bách Khoa Hà Nội",
                    "NXB Đại học Quốc gia Hà Nội",
                    "NXB Đại học Quốc gia TP.HCM",
                    "NXB Khoa học và Kỹ thuật",
                    "NXB Thông tin và Truyền thông",
                    "NXB Đại học Công nghệ",
                    "Springer",
                    "O'Reilly Media",
                    "Manning Publications",
                    "Packt Publishing"
            );

            // Danh sách các chủ đề và lĩnh vực
            List<String> bookTopics = new ArrayList<>(bookTitlesByTopic.keySet());

            for (int i = 0; i < 50; i++) {
                Book book = new Book();

                // Chọn chủ đề ngẫu nhiên
                String topic = bookTopics.get(random.nextInt(bookTopics.size()));

                // Lấy danh sách tên sách theo chủ đề
                List<String> topicTitles = bookTitlesByTopic.get(topic);

                // Chọn tên sách ngẫu nhiên từ danh sách
                String bookName = topicTitles.get(random.nextInt(topicTitles.size()));
                book.setBookName(bookName);

                // Tạo tên tác giả
                book.setAuthor(degrees.get(random.nextInt(degrees.size())) + " " + generateVietnameseName());

                // Xác định loại sách dựa trên tên sách
                if (bookName.toLowerCase().contains("giáo trình") ||
                        bookName.toLowerCase().contains("nhập môn") ||
                        bookName.toLowerCase().contains("nguyên lý") ||
                        bookName.toLowerCase().contains("cơ bản")) {
                    book.setBookType("Giáo trình");
                } else {
                    book.setBookType("Tài liệu tham khảo");
                }

                // Tạo ISBN hợp lệ (13 chữ số)
                book.setIsbn(faker.number().digits(13));

                // Số lượng và tình trạng hợp lý
                int totalCopies = random.nextInt(10, 50);
                book.setTotalCopies(totalCopies);
                book.setAvailableCopies(random.nextInt(1, totalCopies + 1));

                // Năm xuất bản phù hợp với chủ đề
                if (topic.contains("Trí tuệ nhân tạo") || topic.contains("Deep Learning") || topic.contains("IoT")) {
                    // Chủ đề mới
                    book.setPublicationYear(random.nextInt(2015, 2025));
                } else if (topic.contains("Web") || topic.contains("Cloud") || topic.contains("Mobile")) {
                    // Chủ đề tương đối mới
                    book.setPublicationYear(random.nextInt(2010, 2025));
                } else {
                    // Chủ đề cơ bản
                    book.setPublicationYear(random.nextInt(2000, 2025));
                }

                // Ngôn ngữ phù hợp với nhà xuất bản
                String publisher = publishers.get(random.nextInt(publishers.size()));
                if (publisher.startsWith("NXB")) {
                    book.setLanguage("Tiếng Việt");
                } else {
                    book.setLanguage("English");
                }

                // Số trang hợp lý dựa trên loại sách
                if (book.getBookType().equals("Giáo trình")) {
                    book.setPageCount(random.nextInt(300, 800));
                } else {
                    book.setPageCount(random.nextInt(150, 500));
                }

                // Định dạng
                book.setFormat(formats[random.nextInt(formats.length)]);

                // Mô tả chi tiết hơn
                String description = "Cuốn sách \"" + bookName + "\" ";
                if (book.getBookType().equals("Giáo trình")) {
                    description += "là tài liệu giảng dạy được biên soạn công phu, cung cấp kiến thức ";
                    description += topic.toLowerCase() + " một cách hệ thống và toàn diện. ";
                    description += "Đây là tài liệu thiết yếu cho sinh viên, giảng viên và những người muốn tìm hiểu về " + topic.toLowerCase() + ".";
                } else {
                    description += "là sách tham khảo chuyên sâu về " + topic.toLowerCase() + ", ";
                    description += "cung cấp nhiều kiến thức thực tiễn và cập nhật các xu hướng mới nhất trong lĩnh vực. ";
                    description += "Sách phù hợp với người đã có kiến thức nền tảng muốn nâng cao trình độ chuyên môn.";
                }
                book.setDescription(description);

                // Ảnh bìa
                book.setCoverImage("https://covers.openlibrary.org/b/id/" + faker.number().numberBetween(1000000, 1050000) + "-L.jpg");

                // Mã DDC
                book.setDDCCode(ddcRepository.findRandomDDC());

                bookRepository.save(book);
            }
            System.out.println("✅ Hoàn tất tạo dữ liệu sách!");
        }
    }

    // Tạo tên Việt Nam thực tế hơn
    private String generateVietnameseName() {
        Random random = new Random();

        // Họ phổ biến ở Việt Nam
        List<String> LAST_NAMES = List.of(
                "Nguyễn", "Trần", "Lê", "Phạm", "Hoàng", "Vũ", "Đặng", "Bùi", "Đỗ", "Hồ",
                "Ngô", "Dương", "Lý", "Phan", "Võ", "Đào", "Đoàn", "Đinh", "Huỳnh", "Trương"
        );

        // Tên đệm nam
        List<String> MALE_MIDDLE_NAMES = List.of(
                "Văn", "Hữu", "Minh", "Quốc", "Đức", "Thanh", "Công", "Đình", "Xuân", "Tuấn",
                "Anh", "Quang", "Việt", "Bá", "Đăng", "Khắc", "Thành", "Đại", "Mạnh", "Hoàng"
        );

        // Tên đệm nữ
        List<String> FEMALE_MIDDLE_NAMES = List.of(
                "Thị", "Ngọc", "Hoài", "Thanh", "Minh", "Thu", "Phương", "Kim", "Thúy", "Mỹ",
                "Diệu", "Thùy", "Hồng", "Xuân", "Như", "Bích", "Thủy", "Ánh", "Quỳnh", "Hà"
        );

        // Tên nam
        List<String> MALE_FIRST_NAMES = List.of(
                "Hùng", "Nam", "Dũng", "Hiếu", "Minh", "Tuấn", "Thành", "Phong", "Hải", "Đạt",
                "Long", "Vũ", "Trung", "Quân", "Khoa", "Anh", "Phúc", "Sơn", "Huy", "Trí"
        );

        // Tên nữ
        List<String> FEMALE_FIRST_NAMES = List.of(
                "Linh", "Hà", "Mai", "Hương", "Thảo", "Trang", "Phương", "Lan", "Anh", "Ngọc",
                "Huyền", "Nhung", "Yến", "Châu", "Thủy", "Chi", "Nga", "Vân", "Trâm", "Thúy"
        );

        // Xác định giới tính ngẫu nhiên
        boolean isMale = random.nextBoolean();

        String lastName = LAST_NAMES.get(random.nextInt(LAST_NAMES.size()));
        String middleName;
        String firstName;

        if (isMale) {
            middleName = MALE_MIDDLE_NAMES.get(random.nextInt(MALE_MIDDLE_NAMES.size()));
            firstName = MALE_FIRST_NAMES.get(random.nextInt(MALE_FIRST_NAMES.size()));
        } else {
            middleName = FEMALE_MIDDLE_NAMES.get(random.nextInt(FEMALE_MIDDLE_NAMES.size()));
            firstName = FEMALE_FIRST_NAMES.get(random.nextInt(FEMALE_FIRST_NAMES.size()));
        }

        return lastName + " " + middleName + " " + firstName;
    }

    @PostConstruct
    public void seedData() {
        if (userRepository.count() > 0) return;

        List<String> userTypes = List.of("Teacher", "Student", "Researcher", "Patron");
        List<String> membershipTypes = List.of("Đồng", "Bạc", "Vàng");
        List<String> genders = List.of("Male", "Female");
        Random random = new Random();

        for (int i = 0; i < 200; i++) {
            String userId = "211" + String.format("%06d", random.nextInt(1000000));
            String fullName = generateVietnameseName();
            String gender = genders.get(random.nextInt(genders.size()));
            LocalDate dob = faker.date().birthday().toInstant()
                    .atZone(ZoneId.systemDefault()).toLocalDate();
            String status = "ACTIVE";
            LocalDate createdAt = LocalDate.now();
            int memberPoints = random.nextInt(1500);
            LocalDate expiry = createdAt.plusYears(1);
            String nationalID = faker.idNumber().valid();
            String userImage = "https://i.pravatar.cc/150?img=" + faker.number().numberBetween(1, 70);

            User user = new User();
            user.setUserID(userId);
            user.setFullName(fullName);
            user.setUserType(userTypes.get(random.nextInt(userTypes.size())));
            user.setStatus(status);
            user.setCreatedAt(createdAt);
            user.setDob(dob);
            user.setGender(gender);
            user.setExpiry(expiry);
            user.setMemberPoints(memberPoints);
            user.setUserImage(userImage);
            user.setNationalID(nationalID);

            userRepository.save(user);

            // Tạo AuthCredential
            AuthCredential auth = new AuthCredential();
            auth.setUserID(user);
            auth.setEmail(faker.internet().emailAddress());
            auth.setPasswordHash(UUID.randomUUID().toString());
            auth.setLastLogin(Instant.now());
            authCredentialRepository.save(auth);

            // Tạo Membership
            Membership membership = new Membership();
            membership.setUserID(user);
            if (memberPoints > 1000) {
                membership.setMembershipType("Vàng");
            } else if (memberPoints > 500) {
                membership.setMembershipType("Bạc");
            } else {
                membership.setMembershipType("Đồng");
            }
            membership.setUpdatedAt(Instant.now());
            membershipRepository.save(membership);

            // Gán UserRole
            Role role = roleRepository.findByRoleName(user.getUserType());
            if (role != null) {
                UserRole userRole = new UserRole();
                userRole.setUser(user);
                userRole.setRole(role);
                userRole.setAssignedAt(Instant.now());
                userRoleRepository.save(userRole);
            }
        }
    }

    @PostConstruct
    public void seedBorrowRecords() {
        if (borrowRecordRepository.count() > 100) return;

        List<User> users = userRepository.findAll();
        List<Book> books = bookRepository.findAll();
        User librarian = userRepository.findByUserID("librarian").orElseThrow();
        Random random = new Random();

        if (users.isEmpty() || books.isEmpty()) {
            return;
        }

        for (int i = 0; i < 1000; i++) {
            User user = users.get(random.nextInt(users.size()));
            Book book = books.get(random.nextInt(books.size()));


            Instant borrowDate = faker.date().past(60, TimeUnit.DAYS).toInstant();
            Instant dueDate = borrowDate.plus(14, ChronoUnit.DAYS);
            boolean isReturned = random.nextBoolean();
            Instant returnDate = isReturned ? dueDate.plus(random.nextInt(10), ChronoUnit.DAYS) : null;

            BorrowRecord record = new BorrowRecord();
            record.setUserID(user);
            record.setBookID(book);
            record.setBorrowDate(borrowDate);
            record.setDueDate(dueDate);
            record.setExtendCount(random.nextInt(3));
            record.setExtendedDate(record.getExtendCount() > 0 ? dueDate.plus(7, ChronoUnit.DAYS) : null);
            record.setApprovedBy(librarian);
            record.setReturnApprovedBy(isReturned ? librarian : null);
            record.setReturnDate(returnDate);

            borrowRecordRepository.save(record);
        }
    }

    @PostConstruct
    public void generateBookReviews() {
        if (bookReviewRepository.count() < 10) {
            System.out.println("📝 Đang tạo dữ liệu đánh giá sách...");

            // Lấy danh sách tất cả sách và người dùng
            List<Book> allBooks = bookRepository.findAll();
            List<User> allUsers = userRepository.findAll();

            if (allBooks.isEmpty() || allUsers.isEmpty()) {
                System.out.println("⚠️ Không thể tạo đánh giá: Không có sách hoặc người dùng trong hệ thống!");
                return;
            }

            // Danh sách các bình luận tích cực theo thể loại sách
            Map<String, List<String>> positiveCommentsByTopic = new HashMap<>();

            // Lập trình Java
            positiveCommentsByTopic.put("Lập trình Java", List.of(
                    "Sách giải thích rất rõ về các khái niệm OOP trong Java, giúp tôi hiểu sâu hơn về tính kế thừa và đa hình.",
                    "Phần về Stream API và Lambda expressions được trình bày rất dễ hiểu, có nhiều ví dụ thực tế.",
                    "Cuốn sách này đã giúp tôi hiểu rõ hơn về Spring Boot và cách xây dựng RESTful API.",
                    "Tài liệu rất chi tiết về Java Collections Framework, giúp tôi nắm vững cấu trúc dữ liệu.",
                    "Đây là cuốn sách tốt nhất về Java mà tôi từng đọc, đặc biệt là phần Concurrency và Multithreading.",
                    "Rất hữu ích cho việc ôn thi chứng chỉ Oracle Java Certification.",
                    "Sách có nhiều bài tập thực hành giúp củng cố kiến thức hiệu quả."
            ));

            // Trí tuệ nhân tạo
            positiveCommentsByTopic.put("Trí tuệ nhân tạo", List.of(
                    "Sách giới thiệu rất tốt về Machine Learning, từ thuật toán cơ bản đến ứng dụng thực tế.",
                    "Phần về Neural Networks và Deep Learning được trình bày dễ hiểu với nhiều hình ảnh minh họa.",
                    "Tôi rất ấn tượng với các case study về ứng dụng AI trong y tế và tài chính.",
                    "Cuốn sách này đã giúp tôi nắm được các khái niệm phức tạp trong NLP một cách dễ dàng.",
                    "Đây là tài liệu tham khảo tuyệt vời cho cả sinh viên và chuyên gia về AI.",
                    "Phần triển khai các thuật toán với TensorFlow và PyTorch rất chi tiết và dễ làm theo.",
                    "Rất thích cách tác giả giải thích về Reinforcement Learning với ví dụ thực tế."
            ));

            // Phát triển web
            positiveCommentsByTopic.put("Phát triển web", List.of(
                    "Sách cung cấp kiến thức đầy đủ về React và Redux, từ cơ bản đến nâng cao.",
                    "Phần về Responsive Design rất hữu ích cho công việc frontend của tôi.",
                    "Tôi đã xây dựng được một dự án web hoàn chỉnh nhờ hướng dẫn từ cuốn sách này.",
                    "Cuốn sách giúp tôi hiểu rõ hơn về RESTful API và cách thiết kế backend hiệu quả.",
                    "Đây là tài liệu không thể thiếu cho bất kỳ ai muốn học về Angular.",
                    "Phần về security và authentication được trình bày rất chi tiết và thực tế.",
                    "Sách có nhiều mẹo tối ưu hiệu suất web rất hữu ích."
            ));

            // Danh sách các bình luận tiêu cực/trung tính
            List<String> negativeComments = List.of(
                    "Sách khá khó hiểu với người mới bắt đầu, cần có kiến thức nền tảng.",
                    "Một số phần trình bày hơi rườm rà và lặp lại nhiều lần.",
                    "Các ví dụ trong sách đôi khi quá đơn giản, không sát với thực tế công việc.",
                    "Tôi mong đợi nhiều hơn về các case study thực tế trong lĩnh vực này.",
                    "Phần code trong sách có một số lỗi và không được cập nhật theo version mới nhất.",
                    "Sách thiếu phần bài tập và hướng dẫn thực hành.",
                    "Cần bổ sung thêm về các công nghệ mới trong lĩnh vực này.",
                    "Nội dung có vẻ đã lỗi thời so với công nghệ hiện tại.",
                    "Tốc độ xuất bản mới hơi chậm so với sự phát triển của công nghệ.",
                    "Đôi khi thuật ngữ sử dụng khó hiểu và không có giải thích rõ ràng."
            );

            // Tạo khoảng 150-200 đánh giá
            int numberOfReviews = random.nextInt(150, 201);

            for (int i = 0; i < 1000; i++) {
                BookReview review = new BookReview();

                // Chọn sách và người dùng ngẫu nhiên
                Book randomBook = allBooks.get(random.nextInt(allBooks.size()));
                User randomUser = allUsers.get(random.nextInt(allUsers.size()));

                // Đảm bảo mỗi người dùng chỉ đánh giá mỗi cuốn sách một lần
                if (bookReviewRepository.existsByBookIDAndUserID(randomBook, randomUser)) {
                    // Nếu đã tồn tại đánh giá, thử lại với sách khác
                    continue;
                }

                review.setBookID(randomBook);
                review.setUserID(randomUser);

                // Xác định rating ngẫu nhiên (1-5 sao)
                // Phân bố không đều để tạo dữ liệu thực tế hơn (thiên về 4-5 sao)
                int[] ratingDistribution = {1, 2, 3, 3, 4, 4, 4, 5, 5, 5};
                int rating = ratingDistribution[random.nextInt(ratingDistribution.length)];
                review.setRating(rating);

                // Tạo comment dựa trên rating
                String bookName = randomBook.getBookName().toLowerCase();
                String comment;

                if (rating >= 4) {
                    // Bình luận tích cực
                    List<String> positiveComments = null;

                    // Tìm chủ đề phù hợp từ tên sách
                    for (String topic : positiveCommentsByTopic.keySet()) {
                        if (bookName.contains(topic.toLowerCase())) {
                            positiveComments = positiveCommentsByTopic.get(topic);
                            break;
                        }
                    }

                    // Nếu không tìm thấy chủ đề cụ thể, dùng bình luận chung
                    if (positiveComments == null) {
                        positiveComments = List.of(
                                "Cuốn sách rất hay và bổ ích, tôi học được nhiều điều mới.",
                                "Nội dung được trình bày rõ ràng, dễ hiểu với nhiều ví dụ thực tế.",
                                "Sách rất phù hợp cho cả người mới bắt đầu và người đã có kinh nghiệm.",
                                "Tôi rất thích cách tác giả trình bày vấn đề một cách logic và súc tích.",
                                "Đây là một trong những cuốn sách tốt nhất về chủ đề này mà tôi từng đọc.",
                                "Sách có nhiều thông tin hữu ích và cập nhật với xu hướng hiện nay.",
                                "Tài liệu rất chi tiết và có tính học thuật cao."
                        );
                    }

                    comment = positiveComments.get(random.nextInt(positiveComments.size()));
                } else if (rating == 3) {
                    // Bình luận trung tính
                    comment = negativeComments.get(random.nextInt(negativeComments.size()));
                } else {
                    // Bình luận tiêu cực
                    comment = negativeComments.get(random.nextInt(negativeComments.size()));

                    // Thêm từ ngữ tiêu cực hơn cho rating thấp
                    List<String> negativeOpeners = List.of(
                            "Thất vọng với cuốn sách này. ",
                            "Không như mong đợi. ",
                            "Tôi không khuyên bạn đọc cuốn này. ",
                            "Đáng lẽ không nên mua cuốn này. "
                    );

                    comment = negativeOpeners.get(random.nextInt(negativeOpeners.size())) + comment;
                }

                review.setComment(comment);

                // Tạo ngày đánh giá ngẫu nhiên trong 2 năm gần đây
                LocalDate now = LocalDate.now();
                int daysToSubtract = random.nextInt(1, 730); // Tối đa 2 năm
                review.setCreatedAt(now.minusDays(daysToSubtract));

                // Lưu đánh giá
                bookReviewRepository.save(review);
            }

            System.out.println("✅ Hoàn tất tạo " + numberOfReviews + " đánh giá sách!");
        }
    }

    // Cần thêm method này vào BookReviewRepository
    //endregion
}

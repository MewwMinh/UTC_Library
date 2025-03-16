package edu.utc.demo_01.service;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class FakeDataService {
//    PasswordEncoder passwordEncoder;
//    UserRepository userRepository;
//    AuthCredentialRepository authCredentialRepository;
//    UserRoleRepository userRoleRepository;
//    RoleRepository roleRepository;
//    MembershipRepository membershipRepository;
//    BookRepository bookRepository;
//    DDCClassificationRepository ddcRepository;
//    BorrowRecordRepository borrowRecordRepository;
//    BookReviewRepository bookReviewRepository;
//    TicketResponseRepository ticketResponseRepository;
//    HelpTicketRepository helpTicketRepository;
//    UserAchievementRepository userAchievementRepository;
//    PointHistoryRepository pointHistoryRepository;
//    UserFavoriteRepository userFavoriteRepository;
//    BookReservationRepository bookReservationRepository;
//    AchievementRepository achievementRepository;
//    EventRepository eventRepository;
//    EventParticipantRepository eventParticipantRepository;
//
//    Faker faker = new Faker();
//    Random random = new Random();
//
//    //region Name
//    private static final List<String> LAST_NAMES = List.of(
//            "Nguyễn", "Trần", "Lê", "Phạm", "Hoàng", "Vũ", "Đặng", "Bùi", "Đỗ", "Hồ",
//            "Ngô", "Dương", "Lý", "Phan", "Võ", "Đào", "Đoàn", "Đinh", "Huỳnh", "Trương"
//    );
//
//    private static final List<String> MALE_MIDDLE_NAMES = List.of(
//            "Văn", "Hữu", "Minh", "Quốc", "Đức", "Thanh", "Công", "Đình", "Xuân", "Tuấn",
//            "Anh", "Quang", "Việt", "Bá", "Đăng", "Khắc", "Thành", "Đại", "Mạnh", "Hoàng"
//    );
//
//    private static final List<String> FEMALE_MIDDLE_NAMES = List.of(
//            "Thị", "Ngọc", "Hoài", "Thanh", "Minh", "Thu", "Phương", "Kim", "Thúy", "Mỹ",
//            "Diệu", "Thùy", "Hồng", "Xuân", "Như", "Bích", "Thủy", "Ánh", "Quỳnh", "Hà"
//    );
//
//    private static final List<String> MALE_FIRST_NAMES = List.of(
//            "Hùng", "Nam", "Dũng", "Hiếu", "Minh", "Tuấn", "Thành", "Phong", "Hải", "Đạt",
//            "Long", "Vũ", "Trung", "Quân", "Khoa", "Anh", "Phúc", "Sơn", "Huy", "Trí"
//    );
//
//    private static final List<String> FEMALE_FIRST_NAMES = List.of(
//            "Linh", "Hà", "Mai", "Hương", "Thảo", "Trang", "Phương", "Lan", "Anh", "Ngọc",
//            "Huyền", "Nhung", "Yến", "Châu", "Thủy", "Chi", "Nga", "Vân", "Trâm", "Thúy"
//    );
//    //endregion
//
//    //region FakeUser
//    FakePatron generateVietnamesePatron() {
//        // Điều chỉnh tỉ lệ nam/nữ (50-50 hoặc lệch nhẹ, ví dụ 55% nữ)
//        boolean isMale = random.nextDouble() < 0.50;
//        String gender = isMale ? "Nam" : "Nữ";
//
//        // Tỷ lệ tên 4 chữ khoảng 20-25% thay vì 50%
//        boolean hasTwoMiddleNames = random.nextDouble() < 0.20;
//
//        String lastName = LAST_NAMES.get(random.nextInt(LAST_NAMES.size()));
//        String firstName;
//        StringBuilder fullName = new StringBuilder(lastName);
//
//        if (isMale) {
//            String middleName1 = MALE_MIDDLE_NAMES.get(random.nextInt(MALE_MIDDLE_NAMES.size()));
//
//            if (hasTwoMiddleNames) {
//                String middleName2;
//                do {
//                    middleName2 = MALE_MIDDLE_NAMES.get(random.nextInt(MALE_MIDDLE_NAMES.size()));
//                } while (middleName2.equals(middleName1));
//
//                fullName.append(" ").append(middleName1).append(" ").append(middleName2);
//            } else {
//                fullName.append(" ").append(middleName1);
//            }
//
//            firstName = MALE_FIRST_NAMES.get(random.nextInt(MALE_FIRST_NAMES.size()));
//        } else {
//            String middleName1 = FEMALE_MIDDLE_NAMES.get(random.nextInt(FEMALE_MIDDLE_NAMES.size()));
//
//            if (hasTwoMiddleNames) {
//                String middleName2;
//                do {
//                    middleName2 = FEMALE_MIDDLE_NAMES.get(random.nextInt(FEMALE_MIDDLE_NAMES.size()));
//                } while (middleName2.equals(middleName1));
//
//                fullName.append(" ").append(middleName1).append(" ").append(middleName2);
//            } else {
//                fullName.append(" ").append(middleName1);
//            }
//
//            firstName = FEMALE_FIRST_NAMES.get(random.nextInt(FEMALE_FIRST_NAMES.size()));
//        }
//
//        fullName.append(" ").append(firstName);
//        return new FakePatron(fullName.toString(), gender);
//    }
//    String getRandomPatronRole() {
//        int roll = random.nextInt(100); // Giá trị từ 0 đến 99
//
//        if (roll < 80) return "Student";  // 80%
//        else if (roll < 90) return "Teacher"; // 10% (80-89)
//        else if (roll < 95) return "Researcher"; // 5% (90-94)
//        else return "Patron"; // 5% (95-99)
//    }
//    String getRandomStaffRole() {
//        int roll = random.nextInt(100); // Giá trị từ 0 đến 99
//
//        if (roll < 70) return "Coordinator";
//        else return "Librarian";
//    }
//    @PostConstruct
//    public void userData() {
//        if (userRepository.count() > 100) return;
//
//        List<String> membershipTypes = List.of("Đồng", "Bạc", "Vàng");
//
//        for (int i = 0; i < 500; i++) {
//            String userId = "211" + String.format("%06d", random.nextInt(1000000));
//            FakePatron patron = generateVietnamesePatron();
//            LocalDate dob = faker.date().birthday(18, 24).toInstant()
//                    .atZone(ZoneId.systemDefault()).toLocalDate();
//            String status = "Hoạt động";
//            LocalDate startDate = LocalDate.of(2022, 1, 1);
//            LocalDate endDate = LocalDate.of(2025, 12, 31);
//            long daysBetween = ChronoUnit.DAYS.between(startDate, endDate);
//            LocalDate createdAt = startDate.plusDays(faker.number().numberBetween(0, (int) daysBetween));
//            int memberPoints = (int) Math.sqrt(random.nextInt(1500 * 1500));
//            LocalDate expiry = createdAt.plusYears(5);
//            String nationalID = faker.idNumber().valid();
//            String userImage = "https://i.pravatar.cc/150?img=" + faker.number().numberBetween(1, 70);
//
//            User user = new User();
//            user.setUserID(userId);
//            user.setFullName(patron.getName());
//            user.setUserType("Patron");
//            user.setStatus(status);
//            user.setCreatedAt(createdAt);
//            user.setDob(dob);
//            user.setGender(patron.getGender());
//            user.setExpiry(expiry);
//            user.setMemberPoints(memberPoints);
//            user.setUserImage(userImage);
//            user.setNationalID(nationalID);
//
//            userRepository.save(user);
//
//            // Tạo AuthCredential
//            AuthCredential auth = new AuthCredential();
//            auth.setUserID(user);
//            auth.setEmail(userId + "@lms.utc.edu.vn");
//            auth.setPasswordHash(passwordEncoder.encode("123456"));
//            auth.setLastLogin(Instant.now());
//            authCredentialRepository.save(auth);
//
//            // Tạo Membership
//            Membership membership = new Membership();
//            membership.setUserID(user);
//            if (memberPoints > 1000) {
//                membership.setMembershipType("Vàng");
//            } else if (memberPoints > 500) {
//                membership.setMembershipType("Bạc");
//            } else {
//                membership.setMembershipType("Đồng");
//            }
//            membership.setUpdatedAt(Instant.now());
//            membershipRepository.save(membership);
//
//            // Gán UserRole
//            Role role = roleRepository.findByRoleName(getRandomPatronRole());
//            if (role != null) {
//                UserRole userRole = new UserRole();
//                userRole.setUser(user);
//                userRole.setRole(role);
//                userRole.setAssignedAt(Instant.now());
//                userRoleRepository.save(userRole);
//            }
//        }
//        for (int i = 0; i < 20; i++) {
//            String userId = "666" + String.format("%06d", random.nextInt(1000000));
//            FakePatron patron = generateVietnamesePatron();
//            LocalDate dob = faker.date().birthday(28, 56).toInstant()
//                    .atZone(ZoneId.systemDefault()).toLocalDate();
//            String status = "Hoạt động";
//            LocalDate startDate = LocalDate.of(2022, 1, 1);
//            LocalDate endDate = LocalDate.of(2025, 12, 31);
//            long daysBetween = ChronoUnit.DAYS.between(startDate, endDate);
//            LocalDate createdAt = startDate.plusDays(faker.number().numberBetween(0, (int) daysBetween));
//            LocalDate expiry = createdAt.plusYears(10);
//            String nationalID = faker.idNumber().valid();
//            String userImage = "https://i.pravatar.cc/150?img=" + faker.number().numberBetween(1, 70);
//
//            User user = new User();
//            user.setUserID(userId);
//            user.setFullName(patron.getName());
//            user.setUserType("Staff");
//            user.setStatus(status);
//            user.setCreatedAt(createdAt);
//            user.setDob(dob);
//            user.setGender(patron.getGender());
//            user.setExpiry(expiry);
//            user.setUserImage(userImage);
//            user.setNationalID(nationalID);
//
//            userRepository.save(user);
//
//            // Tạo AuthCredential
//            AuthCredential auth = new AuthCredential();
//            auth.setUserID(user);
//            auth.setEmail(userId + "@lms.utc.edu.vn");
//            auth.setPasswordHash(passwordEncoder.encode("123456"));
//            auth.setLastLogin(Instant.now());
//            authCredentialRepository.save(auth);
//
//            // Gán UserRole
//            Role role = roleRepository.findByRoleName(getRandomStaffRole());
//            if (role != null) {
//                UserRole userRole = new UserRole();
//                userRole.setUser(user);
//                userRole.setRole(role);
//                userRole.setAssignedAt(Instant.now());
//                userRoleRepository.save(userRole);
//            }
//        }
//    }
//    //endregion
//
//    //region FakeBook
//    @PostConstruct
//    public void generateFakeBooks() {
//        if (bookRepository.count() <= 100) {
//            String[] formats = {"14,5 cm x 20,5 cm", "16 cm x 24 cm", "19 cm × 27 cm", "13 cm × 19 cm"};
//
//            // Danh sách tên sách thực tế theo chủ đề
//            Map<String, List<String>> bookTitlesByTopic = new HashMap<>();
//
//            // Lập trình Java
//            bookTitlesByTopic.put("Lập trình Java", List.of(
//                    "Java Core - Nền tảng lập trình hiện đại",
//                    "Lập trình hướng đối tượng với Java",
//                    "Java Spring Boot - Xây dựng ứng dụng enterprise",
//                    "Java Design Patterns - Các mẫu thiết kế phần mềm",
//                    "Lập trình đa luồng và bất đồng bộ trong Java",
//                    "Java và Microservices - Kiến trúc phân tán hiện đại",
//                    "Phát triển ứng dụng web với Java Servlet và JSP",
//                    "Hibernate và JPA - Thao tác với cơ sở dữ liệu trong Java",
//                    "Bảo mật ứng dụng Java - Nguyên lý và thực hành",
//                    "Xây dựng RESTful API với Java Spring"
//            ));
//
//            // Trí tuệ nhân tạo
//            bookTitlesByTopic.put("Trí tuệ nhân tạo", List.of(
//                    "Nhập môn Trí tuệ nhân tạo và Học máy",
//                    "Deep Learning - Lý thuyết và ứng dụng",
//                    "Xử lý ngôn ngữ tự nhiên với Python và TensorFlow",
//                    "Computer Vision - Nhận diện và phân tích hình ảnh",
//                    "Reinforcement Learning - Học tăng cường và ứng dụng",
//                    "Trí tuệ nhân tạo trong phân tích dữ liệu lớn",
//                    "Học máy cho người mới bắt đầu",
//                    "Neural Networks - Mạng nơ-ron và ứng dụng thực tiễn",
//                    "AI và đạo đức - Những thách thức của công nghệ thông minh",
//                    "Trí tuệ nhân tạo ứng dụng trong y tế và chẩn đoán"
//            ));
//
//            // Hệ thống nhúng
//            bookTitlesByTopic.put("Hệ thống nhúng", List.of(
//                    "Lập trình Vi điều khiển với Arduino",
//                    "Thiết kế và phát triển hệ thống IoT",
//                    "Hệ thống nhúng thời gian thực với RTOS",
//                    "Lập trình Raspberry Pi cho IoT và automation",
//                    "Thiết kế mạch điện tử cho hệ thống nhúng",
//                    "Hệ thống nhúng và cảm biến thông minh",
//                    "Phát triển ứng dụng nhúng với Linux",
//                    "Thiết kế hệ thống nhúng tiết kiệm năng lượng",
//                    "Giao tiếp trong hệ thống IoT - Các giao thức và chuẩn",
//                    "Bảo mật cho hệ thống IoT và thiết bị nhúng"
//            ));
//
//            // Phát triển web
//            bookTitlesByTopic.put("Phát triển web", List.of(
//                    "Phát triển web Full-Stack với MERN",
//                    "Lập trình Frontend hiện đại với React và Redux",
//                    "Angular - Framework toàn diện cho ứng dụng web",
//                    "Node.js - Xây dựng ứng dụng server-side hiệu năng cao",
//                    "Responsive Web Design - Thiết kế web đáp ứng",
//                    "Progressive Web Apps - Tương lai của web application",
//                    "CSS nâng cao và SASS/SCSS",
//                    "API RESTful - Thiết kế và phát triển",
//                    "TypeScript - JavaScript mạnh mẽ với kiểu dữ liệu tĩnh",
//                    "Web Performance Optimization - Tối ưu hiệu suất ứng dụng web"
//            ));
//
//            // Bảo mật thông tin
//            bookTitlesByTopic.put("Bảo mật thông tin", List.of(
//                    "Bảo mật mạng và hệ thống thông tin",
//                    "Ethical Hacking - Kỹ thuật tấn công và phòng thủ",
//                    "Mật mã học ứng dụng trong bảo mật dữ liệu",
//                    "Phân tích và phòng chống mã độc",
//                    "Bảo mật ứng dụng web - OWASP Top 10",
//                    "Điều tra số và phân tích dữ liệu pháp lý",
//                    "Zero Trust Security - Mô hình bảo mật không tin tưởng",
//                    "Bảo mật Cloud và Container",
//                    "DevSecOps - Tích hợp bảo mật vào quy trình phát triển",
//                    "Quản lý rủi ro và tuân thủ an ninh thông tin"
//            ));
//
//            // Khoa học dữ liệu
//            bookTitlesByTopic.put("Khoa học dữ liệu", List.of(
//                    "Python cho Khoa học dữ liệu và Phân tích",
//                    "Khai phá dữ liệu - Nguyên lý và kỹ thuật",
//                    "Trực quan hóa dữ liệu với D3.js và Matplotlib",
//                    "Big Data Analytics với Hadoop và Spark",
//                    "Thống kê và xác suất cho Khoa học dữ liệu",
//                    "Machine Learning trong phân tích dữ liệu",
//                    "Data Wrangling - Xử lý và chuẩn bị dữ liệu",
//                    "SQL và NoSQL - Quản lý và truy vấn dữ liệu lớn",
//                    "Dự báo và phân tích chuỗi thời gian",
//                    "Phân tích dữ liệu xã hội và khai thác ý kiến"
//            ));
//
//            // Quản lý dự án phần mềm
//            bookTitlesByTopic.put("Quản lý dự án phần mềm", List.of(
//                    "Phương pháp Agile trong phát triển phần mềm",
//                    "Scrum - Framework cho quản lý dự án linh hoạt",
//                    "DevOps - Kết hợp phát triển và vận hành",
//                    "Quản lý dự án phần mềm theo chuẩn PMI",
//                    "Ước lượng và lập kế hoạch dự án phần mềm",
//                    "Lean Software Development - Phát triển tinh gọn",
//                    "Quản lý rủi ro trong dự án CNTT",
//                    "Kanban - Quản lý luồng công việc hiệu quả",
//                    "Product Owner - Vai trò và kỹ năng trong Agile",
//                    "Continuous Integration & Continuous Delivery"
//            ));
//
//            // Cấu trúc dữ liệu và Giải thuật
//            bookTitlesByTopic.put("Cấu trúc dữ liệu và Giải thuật", List.of(
//                    "Cấu trúc dữ liệu và giải thuật cơ bản",
//                    "Phân tích và thiết kế thuật toán",
//                    "Lập trình động và backtracking",
//                    "Thuật toán tìm kiếm và sắp xếp nâng cao",
//                    "Cấu trúc dữ liệu đồ thị và ứng dụng",
//                    "Cây nhị phân tìm kiếm và cây cân bằng",
//                    "Thuật toán tham lam và quy hoạch động",
//                    "Giải thuật xử lý chuỗi và pattern matching",
//                    "Cấu trúc dữ liệu cho Big Data",
//                    "Thuật toán song song và phân tán"
//            ));
//
//            // Hệ điều hành
//            bookTitlesByTopic.put("Hệ điều hành", List.of(
//                    "Nguyên lý hệ điều hành hiện đại",
//                    "Linux/UNIX - Quản trị hệ thống",
//                    "Lập trình Shell và Scripting",
//                    "Quản lý bộ nhớ và tiến trình trong hệ điều hành",
//                    "Hệ điều hành thời gian thực",
//                    "Ảo hóa và Container trong hệ thống hiện đại",
//                    "Hệ điều hành nhúng và IoT",
//                    "Windows Server - Quản trị và cấu hình",
//                    "Lập trình hệ thống với C/C++",
//                    "Cloud OS và Distributed Operating Systems"
//            ));
//
//            // Mạng máy tính
//            bookTitlesByTopic.put("Mạng máy tính", List.of(
//                    "Nguyên lý và giao thức mạng máy tính",
//                    "Bảo mật mạng doanh nghiệp",
//                    "Mạng không dây và di động",
//                    "Cloud Computing và Virtualization",
//                    "Software-Defined Networking",
//                    "Thiết kế và triển khai mạng Cisco",
//                    "IPv6 - Giao thức Internet thế hệ mới",
//                    "Mạng 5G và ứng dụng",
//                    "Quản trị mạng doanh nghiệp quy mô lớn",
//                    "VoIP và Unified Communications"
//            ));
//
//            List<String> degrees = List.of("TS.", "ThS.", "GS.", "PGS.TS.");
//
//            // Danh sách nhà xuất bản
//            List<String> publishers = List.of(
//                    "NXB Bách Khoa Hà Nội",
//                    "NXB Đại học Quốc gia Hà Nội",
//                    "NXB Đại học Quốc gia TP.HCM",
//                    "NXB Khoa học và Kỹ thuật",
//                    "NXB Thông tin và Truyền thông",
//                    "NXB Đại học Công nghệ",
//                    "Springer",
//                    "O'Reilly Media",
//                    "Manning Publications",
//                    "Packt Publishing"
//            );
//
//            // Danh sách các chủ đề và lĩnh vực
//            List<String> bookTopics = new ArrayList<>(bookTitlesByTopic.keySet());
//
//            for (int i = 0; i < 100; i++) {
//                Book book = new Book();
//
//                // Chọn chủ đề ngẫu nhiên
//                String topic = bookTopics.get(random.nextInt(bookTopics.size()));
//
//                // Lấy danh sách tên sách theo chủ đề
//                List<String> topicTitles = bookTitlesByTopic.get(topic);
//
//                // Chọn tên sách ngẫu nhiên từ danh sách
//                String bookName = topicTitles.get(random.nextInt(topicTitles.size()));
//                book.setBookName(bookName);
//
//                // Tạo tên tác giả
//                book.setAuthor(degrees.get(random.nextInt(degrees.size())) + " " + generateVietnamesePatron().getName());
//
//                // Xác định loại sách dựa trên tên sách
//                if (bookName.toLowerCase().contains("giáo trình") ||
//                        bookName.toLowerCase().contains("nhập môn") ||
//                        bookName.toLowerCase().contains("nguyên lý") ||
//                        bookName.toLowerCase().contains("cơ bản")) {
//                    book.setBookType("Giáo trình");
//                } else {
//                    book.setBookType("Tài liệu tham khảo");
//                }
//
//                // Tạo ISBN hợp lệ (13 chữ số)
//                book.setIsbn(faker.number().digits(13));
//
//                // Số lượng và tình trạng hợp lý
//                int totalCopies = random.nextInt(10, 50);
//                book.setTotalCopies(totalCopies);
//                book.setAvailableCopies(random.nextInt(1, totalCopies + 1));
//
//                // Năm xuất bản phù hợp với chủ đề
//                if (topic.contains("Trí tuệ nhân tạo") || topic.contains("Deep Learning") || topic.contains("IoT")) {
//                    // Chủ đề mới
//                    book.setPublicationYear(random.nextInt(2015, 2025));
//                } else if (topic.contains("Web") || topic.contains("Cloud") || topic.contains("Mobile")) {
//                    // Chủ đề tương đối mới
//                    book.setPublicationYear(random.nextInt(2010, 2025));
//                } else {
//                    // Chủ đề cơ bản
//                    book.setPublicationYear(random.nextInt(2000, 2025));
//                }
//
//                // Ngôn ngữ phù hợp với nhà xuất bản
//                String publisher = publishers.get(random.nextInt(publishers.size()));
//                if (publisher.startsWith("NXB")) {
//                    book.setLanguage("Tiếng Việt");
//                } else {
//                    book.setLanguage("English");
//                }
//
//                // Số trang hợp lý dựa trên loại sách
//                if (book.getBookType().equals("Giáo trình")) {
//                    book.setPageCount(random.nextInt(300, 800));
//                } else {
//                    book.setPageCount(random.nextInt(150, 500));
//                }
//
//                // Định dạng
//                book.setFormat(formats[random.nextInt(formats.length)]);
//
//                // Mô tả chi tiết hơn
//                String description = "Cuốn sách \"" + bookName + "\" ";
//                if (book.getBookType().equals("Giáo trình")) {
//                    description += "là tài liệu giảng dạy được biên soạn công phu, cung cấp kiến thức ";
//                    description += topic.toLowerCase() + " một cách hệ thống và toàn diện. ";
//                    description += "Đây là tài liệu thiết yếu cho sinh viên, giảng viên và những người muốn tìm hiểu về " + topic.toLowerCase() + ".";
//                } else {
//                    description += "là sách tham khảo chuyên sâu về " + topic.toLowerCase() + ", ";
//                    description += "cung cấp nhiều kiến thức thực tiễn và cập nhật các xu hướng mới nhất trong lĩnh vực. ";
//                    description += "Sách phù hợp với người đã có kiến thức nền tảng muốn nâng cao trình độ chuyên môn.";
//                }
//                book.setDescription(description);
//
//                // Ảnh bìa
//                book.setCoverImage("https://covers.openlibrary.org/b/id/" + faker.number().numberBetween(1000000, 1050000) + "-L.jpg");
//
//                // Mã DDC
//                book.setDDCCode(ddcRepository.findRandomDDC());
//
//                bookRepository.save(book);
//            }
//        }
//    }
//    //endregion
//
//    //region Fake Book Reviews
//    @PostConstruct
//    public void generateFakeBookReviews() {
//        if (bookReviewRepository.count() < 10) {
//            // Lấy danh sách tất cả sách và người dùng
//            List<Book> allBooks = bookRepository.findAll();
//            List<User> allUsers = userRepository.findAllPatron();
//
//            if (allBooks.isEmpty() || allUsers.isEmpty()) {
//                System.out.println("⚠️ Không thể tạo đánh giá: Không có sách hoặc người dùng trong hệ thống!");
//                return;
//            }
//
//            // Danh sách các bình luận tích cực theo thể loại sách
//            Map<String, List<String>> positiveCommentsByTopic = new HashMap<>();
//
//            // Lập trình Java
//            positiveCommentsByTopic.put("Lập trình Java", List.of(
//                    "Sách giải thích rất rõ về các khái niệm OOP trong Java, giúp tôi hiểu sâu hơn về tính kế thừa và đa hình.",
//                    "Phần về Stream API và Lambda expressions được trình bày rất dễ hiểu, có nhiều ví dụ thực tế.",
//                    "Cuốn sách này đã giúp tôi hiểu rõ hơn về Spring Boot và cách xây dựng RESTful API.",
//                    "Tài liệu rất chi tiết về Java Collections Framework, giúp tôi nắm vững cấu trúc dữ liệu.",
//                    "Đây là cuốn sách tốt nhất về Java mà tôi từng đọc, đặc biệt là phần Concurrency và Multithreading.",
//                    "Rất hữu ích cho việc ôn thi chứng chỉ Oracle Java Certification.",
//                    "Sách có nhiều bài tập thực hành giúp củng cố kiến thức hiệu quả."
//            ));
//
//            // Trí tuệ nhân tạo
//            positiveCommentsByTopic.put("Trí tuệ nhân tạo", List.of(
//                    "Sách giới thiệu rất tốt về Machine Learning, từ thuật toán cơ bản đến ứng dụng thực tế.",
//                    "Phần về Neural Networks và Deep Learning được trình bày dễ hiểu với nhiều hình ảnh minh họa.",
//                    "Tôi rất ấn tượng với các case study về ứng dụng AI trong y tế và tài chính.",
//                    "Cuốn sách này đã giúp tôi nắm được các khái niệm phức tạp trong NLP một cách dễ dàng.",
//                    "Đây là tài liệu tham khảo tuyệt vời cho cả sinh viên và chuyên gia về AI.",
//                    "Phần triển khai các thuật toán với TensorFlow và PyTorch rất chi tiết và dễ làm theo.",
//                    "Rất thích cách tác giả giải thích về Reinforcement Learning với ví dụ thực tế."
//            ));
//
//            // Phát triển web
//            positiveCommentsByTopic.put("Phát triển web", List.of(
//                    "Sách cung cấp kiến thức đầy đủ về React và Redux, từ cơ bản đến nâng cao.",
//                    "Phần về Responsive Design rất hữu ích cho công việc frontend của tôi.",
//                    "Tôi đã xây dựng được một dự án web hoàn chỉnh nhờ hướng dẫn từ cuốn sách này.",
//                    "Cuốn sách giúp tôi hiểu rõ hơn về RESTful API và cách thiết kế backend hiệu quả.",
//                    "Đây là tài liệu không thể thiếu cho bất kỳ ai muốn học về Angular.",
//                    "Phần về security và authentication được trình bày rất chi tiết và thực tế.",
//                    "Sách có nhiều mẹo tối ưu hiệu suất web rất hữu ích."
//            ));
//
//            // Danh sách các bình luận tiêu cực/trung tính
//            List<String> negativeComments = List.of(
//                    "Sách khá khó hiểu với người mới bắt đầu, cần có kiến thức nền tảng.",
//                    "Một số phần trình bày hơi rườm rà và lặp lại nhiều lần.",
//                    "Các ví dụ trong sách đôi khi quá đơn giản, không sát với thực tế công việc.",
//                    "Tôi mong đợi nhiều hơn về các case study thực tế trong lĩnh vực này.",
//                    "Phần code trong sách có một số lỗi và không được cập nhật theo version mới nhất.",
//                    "Sách thiếu phần bài tập và hướng dẫn thực hành.",
//                    "Cần bổ sung thêm về các công nghệ mới trong lĩnh vực này.",
//                    "Nội dung có vẻ đã lỗi thời so với công nghệ hiện tại.",
//                    "Tốc độ xuất bản mới hơi chậm so với sự phát triển của công nghệ.",
//                    "Đôi khi thuật ngữ sử dụng khó hiểu và không có giải thích rõ ràng."
//            );
//
//            for (int i = 0; i < 1500; i++) {
//                BookReview review = new BookReview();
//
//                // Chọn sách và người dùng ngẫu nhiên
//                Book randomBook = allBooks.get(random.nextInt(allBooks.size()));
//                User randomUser = allUsers.get(random.nextInt(allUsers.size()));
//
//                // Đảm bảo mỗi người dùng chỉ đánh giá mỗi cuốn sách một lần
//                if (bookReviewRepository.existsByBookIDAndUserID(randomBook, randomUser)) {
//                    // Nếu đã tồn tại đánh giá, thử lại với sách khác
//                    continue;
//                }
//
//                review.setBookID(randomBook);
//                review.setUserID(randomUser);
//
//                // Xác định rating ngẫu nhiên (1-5 sao)
//                // Phân bố không đều để tạo dữ liệu thực tế hơn (thiên về 4-5 sao)
//                int[] ratingDistribution = {1, 2, 3, 3, 4, 4, 4, 5, 5, 5, 5, 5};
//                int rating = ratingDistribution[random.nextInt(ratingDistribution.length)];
//                review.setRating(rating);
//
//                // Tạo comment dựa trên rating
//                String bookName = randomBook.getBookName().toLowerCase();
//                String comment;
//
//                if (rating >= 4) {
//                    // Bình luận tích cực
//                    List<String> positiveComments = null;
//
//                    // Tìm chủ đề phù hợp từ tên sách
//                    for (String topic : positiveCommentsByTopic.keySet()) {
//                        if (bookName.contains(topic.toLowerCase())) {
//                            positiveComments = positiveCommentsByTopic.get(topic);
//                            break;
//                        }
//                    }
//
//                    // Nếu không tìm thấy chủ đề cụ thể, dùng bình luận chung
//                    if (positiveComments == null) {
//                        positiveComments = List.of(
//                                "Cuốn sách rất hay và bổ ích, tôi học được nhiều điều mới.",
//                                "Nội dung được trình bày rõ ràng, dễ hiểu với nhiều ví dụ thực tế.",
//                                "Sách rất phù hợp cho cả người mới bắt đầu và người đã có kinh nghiệm.",
//                                "Tôi rất thích cách tác giả trình bày vấn đề một cách logic và súc tích.",
//                                "Đây là một trong những cuốn sách tốt nhất về chủ đề này mà tôi từng đọc.",
//                                "Sách có nhiều thông tin hữu ích và cập nhật với xu hướng hiện nay.",
//                                "Tài liệu rất chi tiết và có tính học thuật cao."
//                        );
//                    }
//
//                    comment = positiveComments.get(random.nextInt(positiveComments.size()));
//                } else if (rating == 3) {
//                    // Bình luận trung tính
//                    comment = negativeComments.get(random.nextInt(negativeComments.size()));
//                } else {
//                    // Bình luận tiêu cực
//                    comment = negativeComments.get(random.nextInt(negativeComments.size()));
//
//                    // Thêm từ ngữ tiêu cực hơn cho rating thấp
//                    List<String> negativeOpeners = List.of(
//                            "Thất vọng với cuốn sách này. ",
//                            "Không như mong đợi. ",
//                            "Tôi không khuyên bạn đọc cuốn này. ",
//                            "Đáng lẽ không nên mua cuốn này. "
//                    );
//
//                    comment = negativeOpeners.get(random.nextInt(negativeOpeners.size())) + comment;
//                }
//
//                review.setComment(comment);
//
//                // Tạo ngày đánh giá ngẫu nhiên trong 2 năm gần đây
//                LocalDate now = LocalDate.now();
//                int daysToSubtract = random.nextInt(1, 1500); // Tối đa 2 năm
//                review.setCreatedAt(now.minusDays(daysToSubtract));
//
//                // Lưu đánh giá
//                bookReviewRepository.save(review);
//            }
//        }
//    }
//    //endregion
//
//    //region Fake Borrow Records
//    @PostConstruct
//    public void generateFakeBorrowRecords() {
//        if (borrowRecordRepository.count() > 100) return;
//
//        List<User> users = userRepository.findAllPatron();
//        List<Book> books = bookRepository.findAll();
//        List<User> librarians = userRepository.findAllLibrarian();
//
//        if (users.isEmpty() || books.isEmpty()) {
//            return;
//        }
//
//        for (int i = 0; i < 2500; i++) {
//            User user = users.get(random.nextInt(users.size()));
//            Book book = books.get(random.nextInt(books.size()));
//            User librarian = librarians.get(random.nextInt(librarians.size()));
//
//            Instant borrowDate = faker.date().past(200, TimeUnit.DAYS).toInstant();
//            Instant dueDate = borrowDate.plus(90, ChronoUnit.DAYS);
//            boolean isReturned = random.nextBoolean();
//            boolean isLateReturn = random.nextDouble() < 0.05; // 5% xác suất trả muộn
//
//            Instant returnDate = isReturned
//                    ? (isLateReturn
//                    ? dueDate.plus(random.nextInt(1, 11), ChronoUnit.DAYS) // Trả muộn từ 1-10 ngày
//                    : dueDate.minus(random.nextInt(1, 31), ChronoUnit.DAYS)) // Trả sớm từ 1-30 ngày
//                    : null;
//
//            int extendCount;
//            int rand = random.nextInt(10); // Sinh số từ 0 đến 9 (10 giá trị)
//
//            if (rand < 9) {  // 90% xác suất
//                extendCount = 0;
//            } else {  // 10% xác suất chia đều cho 1 và 2
//                extendCount = random.nextInt(2) + 1; // Giá trị 1 hoặc 2
//            }
//
//            BorrowRecord record = new BorrowRecord();
//            record.setUserID(user);
//            record.setBookID(book);
//            record.setBorrowDate(borrowDate);
//            record.setDueDate(dueDate);
//            record.setExtendCount(extendCount);
//            record.setExtendedDate(extendCount > 0 ? dueDate.minus(3, ChronoUnit.DAYS) : null);
//            record.setApprovedBy(librarian);
//            record.setReturnApprovedBy(isReturned ? librarians.get(random.nextInt(librarians.size())) : null);
//            record.setReturnDate(returnDate);
//
//            borrowRecordRepository.save(record);
//        }
//    }
//    //endregion
//
//    //region Fake User Wishlist
//    @PostConstruct
//    public void generateFakeUserWishlist() {
//        if (userFavoriteRepository.count() > 100) return;
//        List<User> users = userRepository.findAllPatron();
//        List<Book> books = bookRepository.findAll();
//        for (int i = 0; i < 1500; i++) {
//            User user = users.get(random.nextInt(users.size()));
//            Book book = books.get(random.nextInt(books.size()));
//            if (userFavoriteRepository.existsByUserIDAndBookID(user, book)) {
//                continue;
//            }
//            UserFavorite userFavorite = new UserFavorite();
//            userFavorite.setUserID(user);
//            userFavorite.setBookID(book);
//            userFavoriteRepository.save(userFavorite);
//        }
//    }
//    //endregion
//
//    //region Fake Book Reservation
//    @PostConstruct
//    public void generateFakeBookReservation() {
//        if (bookReservationRepository.count() > 1) return;
//        List<User> users = userRepository.findAllPatron();
//        List<Book> books = bookRepository.findAll();
//        List<User> librarians = userRepository.findAllLibrarian();
//        for (int i = 0; i < 200; i++) {
//            User user = users.get(random.nextInt(users.size()));
//            Book book = books.get(random.nextInt(books.size()));
//            if (bookReservationRepository.existsByUserIDAndBookID(user, book)) {
//                continue;
//            }
//            LocalDate reservationDate = LocalDate.now().minusDays(random.nextInt(20));
//            LocalDate expiryDate =reservationDate.plus(7, ChronoUnit.DAYS);
//            String status;
//            if (LocalDate.now().isAfter(expiryDate)) {
//                status = random.nextBoolean() ? "Đồng ý" : "Từ chối";
//            }else {
//                status = random.nextBoolean() ? "Đồng ý" : "Đang chờ xác nhận";
//            }
//            LocalDate pickupDate =reservationDate.plusDays(random.nextInt(30));
//            User librarian;
//            if ("Đồng ý".equals(status) || "Từ chối".equals(status)) {
//                librarian = librarians.get(random.nextInt(librarians.size()));
//            }else {
//                librarian = null;
//            }
//
//            BookReservation bookReservation = new BookReservation();
//            bookReservation.setUserID(user);
//            bookReservation.setBookID(book);
//            bookReservation.setReservationDate(reservationDate);
//            bookReservation.setExpiryDate(expiryDate);
//            bookReservation.setStatus(status);
//            bookReservation.setPickupDate(pickupDate);
//            bookReservation.setApprovedBy(librarian);
//            bookReservationRepository.save(bookReservation);
//        }
//    }
//    //endregion
//
//    //region Fake Point History
//    @PostConstruct
//    public void fakeDataPointHistory() {
//        // Kiểm tra nếu đã có dữ liệu trong bảng PointHistory thì không thêm nữa
//        if (pointHistoryRepository.count() > 0) return;
//
//        String[] positiveReasons = {
//                "Trả sách đúng hạn",
//                "Tham gia sự kiện thư viện",
//                "Hỗ trợ tổ chức hội thảo",
//                "Viết đánh giá sách",
//                "Thưởng thành tích học tập",
//                "Thưởng bạn đọc tích cực",
//                "Đóng góp ý kiến cải thiện thư viện",
//                "Chia sẻ sách hay",
//                "Tham gia câu lạc bộ đọc sách"
//        };
//
//        String[] negativeReasons = {
//                "Trễ hạn trả sách",
//                "Vi phạm nội quy thư viện",
//                "Làm hỏng sách",
//                "Làm mất sách",
//                "Để quên thẻ thư viện",
//                "Gây ồn ào trong khu vực đọc yên tĩnh"
//        };
//        List<User> coordinators = userRepository.findAllCoordinator();
//
//        // Lấy danh sách người dùng từ database
//        List<User> users = userRepository.findAllPatron();
//        if (users.isEmpty()) {
//            System.out.println("Không có người dùng trong database. Không thể tạo lịch sử điểm.");
//            return;
//        }
//
//        // Danh sách lưu các đối tượng PointHistory để lưu vào database
//        List<PointHistory> pointHistories = new ArrayList<>();
//
//        // Tạo dữ liệu cho mỗi người dùng
//        for (User user : users) {
//            // Số lượng bản ghi cho mỗi người dùng (từ 0-10)
//            int numRecords = random.nextInt(11);
//
//            for (int i = 0; i < numRecords; i++) {
//                PointHistory pointHistory = new PointHistory();
//                pointHistory.setUserID(user);
//
//                // Quyết định ngẫu nhiên cộng hay trừ điểm
//                boolean isPositive = random.nextDouble() < 0.95; // 95% khả năng là cộng điểm
//
//                if (isPositive) {
//                    // Cộng điểm (từ 1-50)
//                    pointHistory.setPoints(random.nextInt(50) + 1);
//                    pointHistory.setReason(positiveReasons[random.nextInt(positiveReasons.length)]);
//                } else {
//                    // Trừ điểm (từ -1 đến -30)
//                    pointHistory.setPoints(-(random.nextInt(30) + 1));
//                    pointHistory.setReason(negativeReasons[random.nextInt(negativeReasons.length)]);
//                }
//
//                // Gán người cập nhật ngẫu nhiên (trong 20% trường hợp thì để null - cập nhật tự động)
//                if (random.nextDouble() > 0.2) {
//                    // Lấy ngẫu nhiên một người dùng khác làm người cập nhật
//
//                    pointHistory.setUpdatedBy(coordinators.get(random.nextInt(coordinators.size())));
//                }
//
//                // Tạo ngày cập nhật ngẫu nhiên trong vòng 1 năm gần đây
//                LocalDateTime now = LocalDateTime.now();
//                LocalDateTime pastYear = now.minusYears(1);
//
//                long randomEpochDay = pastYear.toLocalDate().toEpochDay() +
//                        (long) (random.nextDouble() * ChronoUnit.DAYS.between(pastYear.toLocalDate(), now.toLocalDate()));
//
//                LocalDate randomDate = LocalDate.ofEpochDay(randomEpochDay);
//                LocalDateTime randomDateTime = randomDate.atTime(
//                        random.nextInt(24), // hour
//                        random.nextInt(60), // minute
//                        random.nextInt(60)  // second
//                );
//
//                Instant randomInstant = randomDateTime.atZone(ZoneId.systemDefault()).toInstant();
//                pointHistory.setCreatedAt(randomInstant);
//
//                pointHistories.add(pointHistory);
//            }
//        }
//
//        // Lưu tất cả dữ liệu vào database
//        pointHistoryRepository.saveAll(pointHistories);
//        System.out.println("Đã tạo " + pointHistories.size() + " bản ghi lịch sử điểm");
//    }
//    //endregion
//
//    //region Fake Achievement
//    @PostConstruct
//    public void fakeAchievement() {
//        if (achievementRepository.count() > 0) return;
//        List<User> users = userRepository.findAllPatron();
//        List<Achievement> achievements = achievementRepository.findAll();
//        for (User user : users) {
//            // Số lượng bản ghi cho mỗi người dùng (từ 0-5)
//            int numRecords = random.nextInt(6);
//
//            for (int i = 0; i < numRecords; i++) {
//                UserAchievement userAchievement = new UserAchievement();
//                userAchievement.setUserID(user);
//                userAchievement.setAchievementID(achievements.get(random.nextInt(achievements.size())));
//
//                // Lấy ngày hiện tại và trừ đi số ngày ngẫu nhiên từ 0 - 99
//                LocalDate randomDate = LocalDate.now().minusDays(random.nextInt(100));
//
//                // Thêm giờ, phút, giây ngẫu nhiên
//                LocalDateTime randomDateTime = randomDate.atTime(
//                        random.nextInt(24),  // Giờ (0-23)
//                        random.nextInt(60),  // Phút (0-59)
//                        random.nextInt(60)   // Giây (0-59)
//                );
//
//                // Chuyển đổi sang Instant
//                Instant awardedAt = randomDateTime.atZone(ZoneId.systemDefault()).toInstant();
//                userAchievement.setAwardedAt(awardedAt);
//                userAchievementRepository.save(userAchievement);
//            }
//        }
//    }
//    //endregion
//
//    //region Fake Help Ticket & Ticket Response
//    private String createResponseTitle(String ticketStatus, int responseIndex, int totalResponses) {
//        // Phản hồi đầu tiên
//        if (responseIndex == 0) {
//            return "Đã tiếp nhận yêu cầu";
//        }
//        // Phản hồi cuối cùng
//        else if (responseIndex == totalResponses - 1) {
//            if (ticketStatus.equals("Đã hoàn thành")) {
//                return "Đã xử lý xong yêu cầu";
//            } else if (ticketStatus.equals("Bị từ chối")) {
//                return "Không thể đáp ứng yêu cầu";
//            } else {
//                return "Cập nhật về yêu cầu của bạn";
//            }
//        }
//        // Phản hồi giữa
//        else {
//            return "Cập nhật tiến độ xử lý";
//        }
//    }
//
//    private String createResponseText(String requestType, String status, int responseIndex, int totalResponses) {
//        // Phản hồi đầu tiên - Tiếp nhận
//        if (responseIndex == 0) {
//            return "Chào bạn,\n\nThư viện đã tiếp nhận yêu cầu của bạn và đang xử lý. "
//                    + "Chúng tôi sẽ cập nhật thông tin trong thời gian sớm nhất.\n\nTrân trọng!";
//        }
//        // Phản hồi cuối cùng - Kết luận
//        else if (responseIndex == totalResponses - 1) {
//            if (status.equals("Đã hoàn thành")) {
//                return "Chào bạn,\n\nThư viện đã xử lý xong yêu cầu của bạn. "
//                        + getRandomCompletionMessage(requestType) + ".\n\nCảm ơn bạn đã sử dụng dịch vụ của thư viện.\n\nTrân trọng!";
//            } else if (status.equals("Bị từ chối")) {
//                return "Chào bạn,\n\nSau khi xem xét, thư viện rất tiếc không thể đáp ứng yêu cầu của bạn vì "
//                        + getRandomRejectionReason(requestType) + ".\n\nRất mong nhận được sự thông cảm từ bạn.\n\nTrân trọng!";
//            } else {
//                return "Chào bạn,\n\nChúng tôi vẫn đang tiếp tục xử lý yêu cầu của bạn. "
//                        + "Quá trình này có thể cần thêm thời gian do " + getRandomProcessingReason(requestType)
//                        + ".\n\nCảm ơn sự kiên nhẫn của bạn.\n\nTrân trọng!";
//            }
//        }
//        // Phản hồi giữa - Cập nhật tiến độ
//        else {
//            return "Chào bạn,\n\nChúng tôi đang xử lý yêu cầu của bạn. "
//                    + getRandomProgressUpdate(requestType) + ".\n\nChúng tôi sẽ tiếp tục cập nhật thông tin.\n\nTrân trọng!";
//        }
//    }
//
//    private String getRandomProgressUpdate(String requestType) {
//        switch (requestType) {
//            case "Mượn/trả sách":
//                return "Chúng tôi đang tìm kiếm cuốn sách trong kho và sẽ thông báo khi có kết quả";
//            case "Gia hạn sách":
//                return "Chúng tôi đang xem xét lịch sử mượn sách của bạn và kiểm tra xem cuốn sách có người đặt hay không";
//            case "Đặt chỗ phòng đọc":
//                return "Chúng tôi đang sắp xếp lịch sử dụng phòng đọc và sẽ sớm có phản hồi chính thức";
//            case "Lỗi hệ thống website/ứng dụng":
//                return "Đội ngũ kỹ thuật đang kiểm tra lỗi bạn báo cáo trên hệ thống";
//            case "Cập nhật thông tin cá nhân":
//                return "Chúng tôi đang xác minh thông tin và cập nhật vào hệ thống";
//            default:
//                return "Chúng tôi đang phối hợp với bộ phận liên quan để giải quyết yêu cầu của bạn";
//        }
//    }
//
//    private String getRandomProcessingReason(String requestType) {
//        switch (requestType) {
//            case "Mượn/trả sách":
//                return "cần kiểm tra kho dự trữ";
//            case "Gia hạn sách":
//                return "cần phê duyệt từ quản lý thư viện";
//            case "Khiếu nại về phạt":
//                return "cần thời gian kiểm tra nhật ký hệ thống";
//            case "Đề xuất sách mới":
//                return "cần thảo luận trong cuộc họp chọn sách tháng tới";
//            default:
//                return "có nhiều yêu cầu đang chờ xử lý";
//        }
//    }
//
//    private String getRandomRejectionReason(String requestType) {
//        switch (requestType) {
//            case "Mượn/trả sách":
//                return "hiện tại cuốn sách này đã hết trong kho";
//            case "Gia hạn sách":
//                return "bạn đã gia hạn quá số lần quy định hoặc cuốn sách đã có người đặt mượn";
//            case "Đặt chỗ phòng đọc":
//                return "phòng đọc đã kín chỗ vào thời gian bạn yêu cầu";
//            case "Khiếu nại về phạt":
//                return "sau khi kiểm tra, hệ thống ghi nhận bạn đã trả sách trễ đúng như thông báo";
//            default:
//                return "yêu cầu của bạn không nằm trong phạm vi hỗ trợ của thư viện";
//        }
//    }
//
//    private String getRandomCompletionMessage(String requestType) {
//        switch (requestType) {
//            case "Mượn/trả sách":
//                return "cuốn sách bạn yêu cầu đã được chuẩn bị và bạn có thể đến quầy để mượn trong vòng 3 ngày kể từ bây giờ";
//            case "Gia hạn sách":
//                return "thư viện đã gia hạn thêm 14 ngày cho cuốn sách của bạn, hạn mới là 27/3/2025";
//            case "Đặt chỗ phòng đọc":
//                return "thư viện đã xác nhận đặt chỗ cho bạn theo thời gian yêu cầu";
//            case "Cập nhật thông tin cá nhân":
//                return "thông tin cá nhân của bạn đã được cập nhật thành công";
//            case "Lỗi hệ thống website/ứng dụng":
//                return "chúng tôi đã khắc phục lỗi và tài khoản của bạn hiện đã hoạt động bình thường";
//            default:
//                return "yêu cầu của bạn đã được xử lý thành công";
//        }
//    }
//
//    private String createSampleTitle(String requestType) {
//        switch (requestType) {
//            case "Mượn/trả sách":
//                return "Yêu cầu hỗ trợ mượn sách " + randomBookTitle();
//            case "Gia hạn sách":
//                return "Xin gia hạn thêm thời gian mượn sách";
//            case "Đặt chỗ phòng đọc":
//                return "Đặt chỗ phòng đọc cho nhóm học tập";
//            case "Lỗi hệ thống website/ứng dụng":
//                return "Không thể đăng nhập vào hệ thống";
//            case "Cập nhật thông tin cá nhân":
//                return "Cập nhật địa chỉ email mới";
//            case "Đề xuất sách mới":
//                return "Đề xuất mua sách " + randomBookTitle();
//            case "Khiếu nại về phạt":
//                return "Khiếu nại về phạt trả sách trễ";
//            case "Báo cáo sách hỏng":
//                return "Báo cáo sách bị hỏng bìa";
//            default:
//                return "Yêu cầu hỗ trợ về " + requestType;
//        }
//    }
//
//    private String createSampleDescription(String requestType) {
//        switch (requestType) {
//            case "Mượn/trả sách":
//                return "Tôi muốn mượn cuốn " + randomBookTitle() + " nhưng không tìm thấy trên hệ thống. Vui lòng kiểm tra giúp tôi xem cuốn sách này còn trong kho không.";
//            case "Gia hạn sách":
//                return "Tôi muốn gia hạn thêm 2 tuần với cuốn sách đang mượn vì đang trong thời gian ôn thi và cần tham khảo thêm. Mã sách: " + randomBookId();
//            case "Đặt chỗ phòng đọc":
//                return "Tôi muốn đặt 1 góc phòng đọc cho nhóm 5 người vào ngày 20/3/2025 từ 14h-17h để thảo luận bài tập lớn.";
//            case "Lỗi hệ thống website/ứng dụng":
//                return "Tôi không thể đăng nhập vào hệ thống, màn hình báo lỗi 'Tài khoản không tồn tại' mặc dù tôi chắc chắn nhập đúng thông tin.";
//            case "Cập nhật thông tin cá nhân":
//                return "Tôi vừa đổi địa chỉ email mới, vui lòng cập nhật email từ abc@gmail.com sang newmail@gmail.com giúp tôi.";
//            case "Đề xuất sách mới":
//                return "Tôi đề xuất thư viện mua thêm cuốn " + randomBookTitle() + " của tác giả " + randomAuthor() + " phục vụ cho môn học Cơ sở dữ liệu phân tán.";
//            case "Khiếu nại về phạt":
//                return "Tôi đã trả sách đúng hạn vào ngày 10/3/2025 nhưng vẫn bị ghi nhận là trễ hạn và bị phạt 50.000đ. Mong thư viện kiểm tra lại giúp.";
//            case "Báo cáo sách hỏng":
//                return "Cuốn sách mã " + randomBookId() + " bị rách bìa và thiếu trang 56-57. Tôi phát hiện khi vừa nhận sách từ thư viện.";
//            default:
//                return "Tôi cần được hỗ trợ về vấn đề liên quan đến " + requestType + ". Mong nhận được phản hồi sớm. Xin cảm ơn!";
//        }
//    }
//
//    private String randomBookTitle() {
//        String[] titles = {
//                "Cơ sở dữ liệu phân tán",
//                "Lập trình Java nâng cao",
//                "Thiết kế hệ thống thông tin",
//                "Phân tích và thiết kế giải thuật",
//                "Trí tuệ nhân tạo",
//                "Kỹ thuật lập trình",
//                "Đại số tuyến tính",
//                "An toàn thông tin",
//                "Học máy cơ bản"
//        };
//        return titles[random.nextInt(titles.length)];
//    }
//
//    private String randomAuthor() {
//        return generateVietnamesePatron().getName();
//    }
//
//    private String randomBookId() {
//        List<Book> books = bookRepository.findAll();
//        Book book = books.get(random.nextInt(books.size()));
//        return book.getBookID();
//    }
//
//    private static final List<String> REQUEST_TYPES = Arrays.asList(
//            "Mượn/trả sách",
//            "Gia hạn sách",
//            "Đặt chỗ phòng đọc",
//            "Lỗi hệ thống website/ứng dụng",
//            "Cập nhật thông tin cá nhân",
//            "Đề xuất sách mới",
//            "Khiếu nại về phạt",
//            "Hỗ trợ tìm tài liệu",
//            "Tài khoản và đăng nhập",
//            "Báo cáo sách hỏng",
//            "Đề xuất sự kiện/hội thảo",
//            "Góp ý cải thiện dịch vụ",
//            "Báo cáo cơ sở vật chất/thiết bị",
//            "Thắc mắc về điểm thành viên",
//            "Vấn đề khác"
//    );
//
//    private static final List<String> TICKET_STATUSES = Arrays.asList(
//            "Đang chờ xử lý", "Đang xử lý", "Đã hoàn thành", "Bị từ chối"
//    );
//
//    private void createSampleTickets(List<User> patrons, List<User> staff) {
//        // Tạo 15 phiếu yêu cầu mẫu
//        for (int i = 0; i < 700; i++) {
//            User patron = patrons.get(random.nextInt(patrons.size()));
//            String requestType = REQUEST_TYPES.get(random.nextInt(REQUEST_TYPES.size()));
//            String status = TICKET_STATUSES.get(random.nextInt(TICKET_STATUSES.size()));
//
//            // Tạo mẫu tiêu đề và nội dung dựa trên loại yêu cầu
//            String title = createSampleTitle(requestType);
//            String description = createSampleDescription(requestType);
//
//            // Tạo timestamp ngẫu nhiên trong khoảng 30 ngày gần đây
//            Instant createdAt = Instant.now().minus(random.nextInt(30), ChronoUnit.DAYS);
//
//            HelpTicket ticket = new HelpTicket();
//            ticket.setUserID(patron);
//            ticket.setProblem(requestType);
//            ticket.setTitle(title);
//            ticket.setDescription(description);
//            ticket.setStatus(status);
//            ticket.setCreatedAt(createdAt);
//
//            HelpTicket savedTicket = helpTicketRepository.save(ticket);
//
//            // Tạo các phản hồi cho ticket này
//            createResponsesForTicket(savedTicket, staff, status);
//        }
//    }
//
//    private void createResponsesForTicket(HelpTicket ticket, List<User> staff, String status) {
//        // Nếu trạng thái là "Đang chờ xử lý", có thể không có phản hồi nào
//        if (status.equals("Đang chờ xử lý") && random.nextBoolean()) {
//            return;
//        }
//
//        // Số lượng phản hồi sẽ tạo, có thể từ 1-3 phản hồi
//        int numberOfResponses = random.nextInt(3) + 1;
//
//        // Thời gian ban đầu cho phản hồi đầu tiên
//        Instant responseTime = ticket.getCreatedAt().plus(random.nextInt(24) + 1, ChronoUnit.HOURS);
//
//        for (int i = 0; i < numberOfResponses; i++) {
//            User staffMember = staff.get(random.nextInt(staff.size()));
//
//            // Tạo nội dung phản hồi phù hợp với số thứ tự của phản hồi
//            String responseTitle = createResponseTitle(status, i, numberOfResponses);
//            String responseText = createResponseText(ticket.getProblem(), status, i, numberOfResponses);
//
//            TicketResponse response = new TicketResponse();
//            response.setTicketID(ticket);
//            response.setStaffID(staffMember);
//            response.setTitle(responseTitle);
//            response.setResponseText(responseText);
//            response.setCreatedAt(responseTime);
//
//            ticketResponseRepository.save(response);
//
//            // Tạo thời gian cho phản hồi tiếp theo (nếu có) sau phản hồi hiện tại
//            responseTime = responseTime.plus(random.nextInt(48) + 6, ChronoUnit.HOURS);
//
//            // Nếu đây là phản hồi cuối cùng, cập nhật trạng thái ticket nếu cần
//            if (i == numberOfResponses - 1) {
//                if (!status.equals(ticket.getStatus())) {
//                    ticket.setStatus(status);
//                    helpTicketRepository.save(ticket);
//                }
//            }
//        }
//    }
//    @PostConstruct
//    @Transactional
//    public void genrateFakeHelpTicketAndTicketResponse() {
//        // Kiểm tra nếu đã có dữ liệu
//        if (helpTicketRepository.count() > 0) {
//            return;
//        }
//
//        // Tìm một số user để tạo yêu cầu
//        List<User> patrons = userRepository.findAllPatron();
//        List<User> staff = userRepository.findAllCoordinator();
//
//        if (patrons.isEmpty() || staff.isEmpty()) {
//            return; // Không có user nào để tạo yêu cầu
//        }
//
//        // Tạo mẫu các phiếu yêu cầu
//        createSampleTickets(patrons, staff);
//    }
//    //endregion
//
//    //region Fake Event
//    @PostConstruct
//    private void createSampleEvents() {
//        if (eventRepository.count() > 0) {
//            return;
//        }
//        List<User> librarians = userRepository.findAllLibrarian();
//        List<User> patrons = userRepository.findAllPatron();
//        if (librarians.isEmpty() || patrons.isEmpty()) {
//            return;
//        }
//
//        // Tạo 30 event đã diễn ra trong 2 năm qua
//        List<Event> pastEvents = createPastEvents(librarians, 30);
//
//        // Tạo 3 event sắp diễn ra
//        List<Event> upcomingEvents = createUpcomingEvents(librarians, 3);
//
//        // Tạo người tham gia cho các event
//        createEventParticipants(patrons, pastEvents, upcomingEvents);
//    }
//
//    private List<Event> createPastEvents(List<User> libraryStaff, int count) {
//        List<Event> events = new ArrayList<>();
//        List<String> eventTitles = generateEventTitles();
//        List<String> eventLocations = generateEventLocations();
//        List<String> statuses = List.of("Đã diễn ra", "Đã hủy");
//
//        // Thời điểm hiện tại
//        LocalDateTime now = LocalDateTime.now();
//
//        // Thời điểm 2 năm trước
//        LocalDateTime twoYearsAgo = now.minusYears(2);
//
//        for (int i = 0; i < count; i++) {
//            // Chọn ngẫu nhiên thời gian bắt đầu trong khoảng 2 năm trước đến hôm nay
//            LocalDateTime startDateTime = randomDateTimeBetween(twoYearsAgo, now.minusDays(1));
//
//            // Thời gian kết thúc từ 1-4 giờ sau khi bắt đầu
//            LocalDateTime endDateTime = startDateTime.plusHours(ThreadLocalRandom.current().nextInt(1, 5));
//
//            // Chọn người tạo ngẫu nhiên từ danh sách nhân viên
//            User creator = libraryStaff.get(ThreadLocalRandom.current().nextInt(libraryStaff.size()));
//
//            // Chọn ngẫu nhiên tiêu đề và địa điểm
//            String title = eventTitles.get(ThreadLocalRandom.current().nextInt(eventTitles.size()));
//            String location = eventLocations.get(ThreadLocalRandom.current().nextInt(eventLocations.size()));
//
//            // 95% event đã diễn ra, 5% event đã hủy
//            String status = ThreadLocalRandom.current().nextInt(100) < 95
//                    ? statuses.get(0)
//                    : statuses.get(1);
//
//            Event event = Event.builder()
//                    .title(title)
//                    .description(generateEventDescription(title))
//                    .startTime(startDateTime.atZone(ZoneId.systemDefault()).toInstant())
//                    .endTime(endDateTime.atZone(ZoneId.systemDefault()).toInstant())
//                    .location(location)
//                    .createdBy(creator)
//                    .status(status)
//                    .build();
//
//            events.add(event);
//        }
//
//        return eventRepository.saveAll(events);
//    }
//
//    private List<Event> createUpcomingEvents(List<User> libraryStaff, int count) {
//        List<Event> events = new ArrayList<>();
//        List<String> eventTitles = generateUpcomingEventTitles();
//        List<String> eventLocations = generateEventLocations();
//
//        // Thời điểm hiện tại
//        LocalDateTime now = LocalDateTime.now();
//
//        for (int i = 0; i < count; i++) {
//            // Sự kiện sắp diễn ra từ 1 đến 30 ngày tới
//            LocalDateTime startDateTime = now.plusDays(ThreadLocalRandom.current().nextInt(1, 31));
//
//            // Thời gian kết thúc từ 1-4 giờ sau khi bắt đầu
//            LocalDateTime endDateTime = startDateTime.plusHours(ThreadLocalRandom.current().nextInt(1, 5));
//
//            // Chọn người tạo ngẫu nhiên từ danh sách nhân viên
//            User creator = libraryStaff.get(ThreadLocalRandom.current().nextInt(libraryStaff.size()));
//
//            // Chọn ngẫu nhiên tiêu đề và địa điểm
//            String title = eventTitles.get(i % eventTitles.size()); // Đảm bảo mỗi sự kiện có tiêu đề khác nhau
//            String location = eventLocations.get(ThreadLocalRandom.current().nextInt(eventLocations.size()));
//
//            Event event = Event.builder()
//                    .title(title)
//                    .description(generateEventDescription(title))
//                    .startTime(startDateTime.atZone(ZoneId.systemDefault()).toInstant())
//                    .endTime(endDateTime.atZone(ZoneId.systemDefault()).toInstant())
//                    .location(location)
//                    .createdBy(creator)
//                    .status("Sắp diễn ra")
//                    .build();
//
//            events.add(event);
//        }
//
//        return eventRepository.saveAll(events);
//    }
//
//    private void createEventParticipants(List<User> allUsers, List<Event> pastEvents, List<Event> upcomingEvents) {
//        List<EventParticipant> allParticipants = new ArrayList<>();
//        List<String> pastStatuses = List.of("Đã tham gia", "Không tham gia");
//        List<String> upcomingStatuses = List.of("Đã đăng ký", "Đã hủy đăng ký");
//
//        // Tạo người tham gia cho các event đã diễn ra
//        for (Event event : pastEvents) {
//            // Nếu event đã hủy, không cần tạo người tham gia
//            if ("Đã hủy".equals(event.getStatus())) {
//                continue;
//            }
//
//            // Chọn ngẫu nhiên số lượng người tham gia từ 20-100
//            int participantCount = ThreadLocalRandom.current().nextInt(20, 101);
//
//            // Tránh trường hợp số người tham gia lớn hơn số người dùng
//            participantCount = Math.min(participantCount, allUsers.size());
//
//            // Tạo danh sách người tham gia ngẫu nhiên
//            List<User> participants = new ArrayList<>(allUsers);
//            Collections.shuffle(participants);
//            participants = participants.subList(0, participantCount);
//
//            for (User user : participants) {
//                // 80% người dùng đã tham gia, 20% đăng ký nhưng không tham gia
//                String status = ThreadLocalRandom.current().nextInt(100) < 90
//                        ? pastStatuses.get(0)
//                        : pastStatuses.get(1);
//
//                // Thời gian đăng ký ngẫu nhiên từ 1-30 ngày trước khi sự kiện diễn ra
//                Instant registrationDate = event.getStartTime().minus(
//                        ThreadLocalRandom.current().nextInt(1, 31), ChronoUnit.DAYS);
//
//                EventParticipant participant = EventParticipant.builder()
//                        .eventID(event)
//                        .userID(user)
//                        .registrationDate(registrationDate)
//                        .attendanceStatus(status)
//                        .build();
//
//                allParticipants.add(participant);
//            }
//        }
//
//        // Tạo người tham gia cho các event sắp diễn ra
//        for (Event event : upcomingEvents) {
//            // Chọn ngẫu nhiên số lượng người tham gia từ 20-50 (ít hơn vì là event sắp diễn ra)
//            int participantCount = ThreadLocalRandom.current().nextInt(20, 51);
//
//            // Tránh trường hợp số người tham gia lớn hơn số người dùng
//            participantCount = Math.min(participantCount, allUsers.size());
//
//            // Tạo danh sách người tham gia ngẫu nhiên
//            List<User> participants = new ArrayList<>(allUsers);
//            Collections.shuffle(participants);
//            participants = participants.subList(0, participantCount);
//
//            for (User user : participants) {
//                // 90% người dùng đã đăng ký, 10% đã hủy đăng ký
//                String status = ThreadLocalRandom.current().nextInt(100) < 90
//                        ? upcomingStatuses.get(0)
//                        : upcomingStatuses.get(1);
//
//                // Thời gian đăng ký ngẫu nhiên từ 1-14 ngày trước hiện tại
//                Instant registrationDate = Instant.now().minus(
//                        ThreadLocalRandom.current().nextInt(1, 15), ChronoUnit.DAYS);
//
//                EventParticipant participant = EventParticipant.builder()
//                        .eventID(event)
//                        .userID(user)
//                        .registrationDate(registrationDate)
//                        .attendanceStatus(status)
//                        .build();
//
//                allParticipants.add(participant);
//            }
//        }
//
//        eventParticipantRepository.saveAll(allParticipants);
//    }
//
//    private LocalDateTime randomDateTimeBetween(LocalDateTime start, LocalDateTime end) {
//        long startEpochDay = start.toLocalDate().toEpochDay();
//        long endEpochDay = end.toLocalDate().toEpochDay();
//        long randomDay = ThreadLocalRandom.current().nextLong(startEpochDay, endEpochDay + 1);
//
//        LocalDateTime randomDate = LocalDateTime.ofEpochSecond(
//                randomDay * 86400, // Số giây trong một ngày
//                0,
//                ZoneId.systemDefault().getRules().getOffset(Instant.now())
//        );
//
//        // Thêm giờ ngẫu nhiên (8:00 - 18:00)
//        return randomDate
//                .withHour(ThreadLocalRandom.current().nextInt(8, 19))
//                .withMinute(ThreadLocalRandom.current().nextInt(0, 60))
//                .withSecond(0)
//                .withNano(0);
//    }
//
//    private List<String> generateEventTitles() {
//        return List.of(
//                "Hội thảo về kỹ năng tìm kiếm học thuật",
//                "Workshop viết luận khoa học",
//                "Tọa đàm hướng nghiệp ngành GTVT",
//                "Triển lãm sách chuyên ngành kỹ thuật",
//                "Hội thảo về công nghệ giao thông thông minh",
//                "Giới thiệu sách mới - Quý 1",
//                "Giới thiệu sách mới - Quý 2",
//                "Giới thiệu sách mới - Quý 3",
//                "Giới thiệu sách mới - Quý 4",
//                "Workshop kỹ năng sử dụng thư viện số",
//                "Tọa đàm với tác giả sách chuyên ngành",
//                "Seminar kỹ năng nghiên cứu khoa học",
//                "Ngày hội đọc sách",
//                "Workshop phương pháp học tập hiệu quả",
//                "Hội thảo cơ hội việc làm ngành GTVT",
//                "Tham quan thư viện dành cho sinh viên năm nhất",
//                "Hội thảo về bảo vệ môi trường trong lĩnh vực giao thông",
//                "Tọa đàm về kỹ năng tìm việc trong ngành GTVT",
//                "Triển lãm sách nghiên cứu khoa học",
//                "Workshop viết báo cáo kỹ thuật",
//                "Cuộc thi tìm kiếm tài liệu nhanh",
//                "Hội nghị sinh viên nghiên cứu khoa học",
//                "Workshop thiết kế CV cho sinh viên",
//                "Tọa đàm về xu hướng phát triển ngành GTVT",
//                "Hội thảo quốc tế về giao thông bền vững",
//                "Workshop tiếng Anh chuyên ngành",
//                "Ngày hội sách kỹ thuật",
//                "Seminar về cách viết đề cương luận văn",
//                "Hội thảo về cơ hội học bổng du học",
//                "Lễ kỷ niệm ngày sách Việt Nam",
//                "Tọa đàm về phương pháp đọc sách hiệu quả",
//                "Workshop kỹ năng trình bày báo cáo",
//                "Cuộc thi ý tưởng sáng tạo sinh viên",
//                "Hội thảo về ứng dụng AI trong giao thông",
//                "Ngày hội trao đổi sách cũ"
//        );
//    }
//
//    private List<String> generateUpcomingEventTitles() {
//        return List.of(
//                "Hội thảo về công nghệ blockchain trong quản lý giao thông",
//                "Workshop về thiết kế đô thị thông minh",
//                "Tọa đàm với chuyên gia quốc tế về phát triển hạ tầng bền vững"
//        );
//    }
//
//    private List<String> generateEventLocations() {
//        return List.of(
//                "Hội trường A1 - Trường Đại học GTVT",
//                "Phòng đọc chính - Thư viện",
//                "Phòng hội thảo B2 - Nhà B",
//                "Sảnh chính - Thư viện trường",
//                "Phòng đa năng - Khu Hiệu bộ",
//                "Hội trường lớn - Nhà A3",
//                "Phòng họp số 1 - Tòa nhà trung tâm",
//                "Sảnh triển lãm - Tầng 1 Thư viện",
//                "Phòng seminar - Tầng 2 Thư viện",
//                "Khu vực ngoài trời - Sân trường"
//        );
//    }
//
//    private String generateEventDescription(String title) {
//        // Tạo mô tả dài hơn dựa trên tiêu đề
//        if (title.contains("hội thảo") || title.contains("Hội thảo")) {
//            return "Hội thảo tập trung thảo luận về những chủ đề mới nhất trong lĩnh vực, với sự góp mặt của các chuyên gia hàng đầu. " +
//                    "Người tham dự có cơ hội mở rộng kiến thức, kết nối và trao đổi ý tưởng với đồng nghiệp. " +
//                    "Chương trình bao gồm các phiên thảo luận, thuyết trình và hoạt động tương tác.";
//        } else if (title.contains("workshop") || title.contains("Workshop")) {
//            return "Workshop thực hành cung cấp kiến thức và kỹ năng cụ thể thông qua các hoạt động thực tế. " +
//                    "Người tham gia sẽ được hướng dẫn bởi các chuyên gia có kinh nghiệm và có cơ hội áp dụng kiến thức vào các tình huống thực tế. " +
//                    "Đây là cơ hội tuyệt vời để nâng cao kỹ năng và mở rộng mạng lưới chuyên môn.";
//        } else if (title.contains("tọa đàm") || title.contains("Tọa đàm")) {
//            return "Buổi tọa đàm là cơ hội để trao đổi ý kiến và kinh nghiệm về các vấn đề liên quan đến chủ đề. " +
//                    "Với sự tham gia của các diễn giả có kinh nghiệm, người tham dự sẽ được tiếp cận với những góc nhìn đa dạng và sâu sắc. " +
//                    "Chương trình khuyến khích sự tham gia tích cực từ khán giả thông qua phần hỏi đáp.";
//        } else if (title.contains("triển lãm") || title.contains("Triển lãm")) {
//            return "Triển lãm trưng bày các tài liệu, ấn phẩm và nghiên cứu mới nhất trong lĩnh vực. " +
//                    "Người tham quan có cơ hội khám phá và tiếp cận với những nguồn tài nguyên phong phú và đa dạng. " +
//                    "Sự kiện cũng bao gồm các hoạt động giới thiệu và hướng dẫn về cách sử dụng hiệu quả các tài liệu.";
//        } else if (title.contains("giới thiệu sách") || title.contains("Giới thiệu sách")) {
//            return "Chương trình giới thiệu những đầu sách mới và giá trị được thư viện bổ sung trong thời gian qua. " +
//                    "Người tham dự sẽ được cập nhật về các xu hướng và chủ đề mới trong các tài liệu học thuật và nghiên cứu. " +
//                    "Đây là cơ hội tốt để độc giả khám phá và mở rộng danh sách đọc của mình.";
//        } else if (title.contains("ngày hội") || title.contains("Ngày hội")) {
//            return "Ngày hội là sự kiện đặc biệt với nhiều hoạt động phong phú và hấp dẫn dành cho cộng đồng. " +
//                    "Chương trình bao gồm các cuộc thi, triển lãm, workshop và nhiều hoạt động tương tác khác. " +
//                    "Đây là cơ hội tuyệt vời để kết nối, học hỏi và chia sẻ niềm đam mê với cộng đồng.";
//        } else if (title.contains("cuộc thi") || title.contains("Cuộc thi")) {
//            return "Cuộc thi là sân chơi thú vị và bổ ích cho những người tham gia. " +
//                    "Thí sinh sẽ có cơ hội thể hiện kiến thức, kỹ năng và sự sáng tạo của mình trong một môi trường cạnh tranh lành mạnh. " +
//                    "Nhiều giải thưởng hấp dẫn sẽ được trao cho những cá nhân và nhóm xuất sắc nhất.";
//        } else if (title.contains("tham quan") || title.contains("Tham quan")) {
//            return "Chương trình tham quan giúp người tham dự làm quen với không gian, dịch vụ và tài nguyên của thư viện. " +
//                    "Đây là cơ hội tốt để hiểu rõ hơn về cách thức hoạt động và cách sử dụng hiệu quả các dịch vụ thư viện. " +
//                    "Người tham gia sẽ được hướng dẫn chi tiết và có cơ hội đặt câu hỏi trực tiếp với nhân viên thư viện.";
//        } else if (title.contains("seminar") || title.contains("Seminar")) {
//            return "Seminar chuyên sâu về chủ đề với sự tham gia của các chuyên gia hàng đầu trong lĩnh vực. " +
//                    "Chương trình tập trung vào việc chia sẻ kiến thức, kinh nghiệm và các nghiên cứu mới nhất. " +
//                    "Người tham dự sẽ có cơ hội mở rộng hiểu biết và kết nối với cộng đồng chuyên môn.";
//        } else if (title.contains("lễ kỷ niệm") || title.contains("Lễ kỷ niệm")) {
//            return "Lễ kỷ niệm là dịp đặc biệt để tôn vinh và ghi nhận tầm quan trọng của sự kiện. " +
//                    "Chương trình bao gồm các bài phát biểu, trình diễn văn nghệ và các hoạt động kỷ niệm khác. " +
//                    "Đây là cơ hội để cộng đồng cùng nhau ôn lại lịch sử và chia sẻ những kỷ niệm đáng nhớ.";
//        } else {
//            return "Sự kiện mang đến cơ hội học hỏi, giao lưu và mở rộng kiến thức cho tất cả người tham dự. " +
//                    "Với nội dung phong phú và đa dạng, chương trình hứa hẹn sẽ mang lại những trải nghiệm bổ ích và thú vị. " +
//                    "Đừng bỏ lỡ cơ hội tham gia và khám phá những điều mới mẻ!";
//        }
//    }
//    //endregion
//
//    //region Fake Achievement
//    @PostConstruct
//    public void generateFakeAchievement() {
//        if (userAchievementRepository.count() > 0) {
//            return; // Skip if data already exists
//        }
//
//        // Fetch all users and achievements
//        List<User> users = userRepository.findAllPatron();
//        List<Achievement> achievements = achievementRepository.findAll();
//
//        if (users.isEmpty() || achievements.isEmpty()) {
//            return; // Skip if no users or achievements exist
//        }
//
//        List<UserAchievement> userAchievements = new ArrayList<>();
//
//        // For each user, assign 1-3 random achievements
//        for (User user : users) {
//            // Shuffle achievements to get random ones
//            Collections.shuffle(achievements);
//
//            // Assign 1-3 random achievements to each user
//            int achievementCount = random.nextInt(5) + 1;
//            for (int i = 0; i < achievementCount && i < achievements.size(); i++) {
//                UserAchievement userAchievement = new UserAchievement();
//                userAchievement.setUserID(user);
//                userAchievement.setAchievementID(achievements.get(i));
//
//                // Set awarded date within the last 6 months
//                // Sinh số ngày ngẫu nhiên trong 180 ngày qua
//                long randomDaysAgo = random.nextInt(180);
//
//                // Sinh giờ, phút, giây ngẫu nhiên
//                int randomHour = random.nextInt(24);   // 0 - 23
//                int randomMinute = random.nextInt(60); // 0 - 59
//                int randomSecond = random.nextInt(60); // 0 - 59
//
//                // Lấy ngày hiện tại và trừ đi số ngày ngẫu nhiên
//                LocalDate randomDate = LocalDate.now().minusDays(randomDaysAgo);
//
//                // Tạo LocalDateTime với thời gian ngẫu nhiên
//                LocalDateTime randomDateTime = randomDate.atTime(randomHour, randomMinute, randomSecond);
//
//                // Chuyển sang Instant (UTC)
//                Instant awardDate = randomDateTime.toInstant(ZoneOffset.UTC);
//                userAchievement.setAwardedAt(awardDate);
//
//                userAchievements.add(userAchievement);
//            }
//        }
//
//        // Save all user achievements
//        userAchievementRepository.saveAll(userAchievements);
//    }
//    //endregion
}

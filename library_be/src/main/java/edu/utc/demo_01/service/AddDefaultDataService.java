package edu.utc.demo_01.service;

import edu.utc.demo_01.entity.LibrarySetting;
import edu.utc.demo_01.repository.*;
import jakarta.annotation.PostConstruct;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AddDefaultDataService {
    PasswordEncoder passwordEncoder;
    RoleRepository roleRepository;
    AchievementRepository achievementRepository;
    DDCClassificationRepository ddcClassificationRepository;
    UserRepository userRepository;
    AuthCredentialRepository authCredentialRepository;
    UserRoleRepository userRoleRepository;
    MembershipRepository membershipRepository;
    LibrarySettingRepository librarySettingRepository;

    //region Library Setting
    @PostConstruct
    public void initSetting() {
        if (librarySettingRepository.count() > 0) return;
        List<LibrarySetting> settings = new ArrayList<>();
        settings.add(createLibrarySetting("MaxTextbooks_GoldMember", "20"));
        settings.add(createLibrarySetting("MaxTextbooks_SilverMember", "15"));
        settings.add(createLibrarySetting("MaxTextbooks_BronzeMember", "10"));
        settings.add(createLibrarySetting("MaxReferenceMaterials_GoldMember", "6"));
        settings.add(createLibrarySetting("MaxReferenceMaterials_SilverMember", "4"));
        settings.add(createLibrarySetting("MaxReferenceMaterials_BronzeMember", "2"));
        settings.add(createLibrarySetting("LateFeeMultiplier_Textbook_Over3Months", "1"));
        settings.add(createLibrarySetting("LateFeeMultiplier_Textbook_Under3Months", "0.5"));
        settings.add(createLibrarySetting("LateFeeMultiplier_ReferenceMaterials_Over30Days", "1"));
        settings.add(createLibrarySetting("LateFeeMultiplier_ReferenceMaterials_Under30Days", "0.5"));
        settings.add(createLibrarySetting("Semester1_BorrowStartDate", "06-15"));
        settings.add(createLibrarySetting("Semester1_BorrowEndDate", "12-14"));
        settings.add(createLibrarySetting("Semester1_LatestReturnDate", "03-14"));
        settings.add(createLibrarySetting("Semester2_BorrowStartDate", "12-15"));
        settings.add(createLibrarySetting("Semester2_BorrowEndDate", "06-14"));
        settings.add(createLibrarySetting("Semester2_LatestReturnDate", "09-14"));
        settings.add(createLibrarySetting("MaximumBorrowingPeriodForReferenceMaterials", "45"));
        settings.add(createLibrarySetting("PointsDeductedForLateTextbookReturn", "20"));
        settings.add(createLibrarySetting("PointsDeductedForLateReferenceMaterialsReturn", "25"));
        settings.add(createLibrarySetting("BonusPointsForOnTimeBookReturn", "10"));
        settings.add(createLibrarySetting("PointsDeductedForDamagedBook", "30"));
        settings.add(createLibrarySetting("PointsDeductedForLostBook", "40"));
        librarySettingRepository.saveAll(settings);
    }

    private LibrarySetting createLibrarySetting(String settingKey, String settingValue) {
        LibrarySetting setting = new LibrarySetting();
        setting.setSettingKey(settingKey);
        setting.setValue(settingValue);
        setting.setUpdateAt(Instant.now());
        return setting;
    }
    //endregion
//
//    //region Roles
//    @PostConstruct
//    public void initRoles() {
//        // Check if roles already exist to avoid duplicate entries
//        if (roleRepository.count() > 0) {
//            return;
//        }
//
//        List<Role> roles = new ArrayList<>();
//
//        roles.add(createRole("MANAGER", "Quản lý"));
//        roles.add(createRole("LIBRARIAN", "Thủ thư"));
//        roles.add(createRole("COORDINATOR", "Quản lý phòng đọc"));
//        roles.add(createRole("TEACHER", "Giảng viên"));
//        roles.add(createRole("STUDENT", "Sinh viên"));
//        roles.add(createRole("RESEARCHER", "Nghiên cứu sinh"));
//        roles.add(createRole("PATRON", "Bạn đọc"));
//
//        // Save all roles
//        roleRepository.saveAll(roles);
//    }
//
//    private Role createRole(String roleName, String description) {
//        Role role = new Role();
//        role.setRoleName(roleName);
//        role.setDescription(description);
//        return role;
//    }
//    //endregion
//
//    //region Achievements
//    @PostConstruct
//    public void initAchievements() {
//        if(achievementRepository.count() > 0) return;
//        List<Achievement> achievements = new ArrayList<>();
//
//        // 1. Thành tích dựa trên số lượng sách mượn
//        achievements.add(createAchievement(
//                "Chăm chỉ đọc sách",
//                "📚",
//                "Đã mượn 10 cuốn sách",
//                10
//        ));
//        achievements.add(createAchievement(
//                "Người yêu sách",
//                "📖",
//                "Đã mượn 50 cuốn sách",
//                25
//        ));
//        achievements.add(createAchievement(
//                "Thủ lĩnh tri thức",
//                "📕",
//                "Đã mượn 100+ cuốn sách",
//                50
//        ));
//
//        // 2. Thành tích mượn sách đúng hạn
//        achievements.add(createAchievement(
//                "Người đọc có trách nhiệm",
//                "⏳",
//                "Hoàn trả sách đúng hạn 10 lần liên tiếp",
//                15
//        ));
//        achievements.add(createAchievement(
//                "Độc giả đáng tin cậy",
//                "🏆",
//                "Không có lịch sử trả sách trễ trong 1 năm",
//                30
//        ));
//        achievements.add(createAchievement(
//                "Hoàn hảo tuyệt đối",
//                "💯",
//                "Không có bất kỳ lần trễ hạn nào từ khi đăng ký (số sách đã mượn > 20)",
//                50
//        ));
//
//        // 3. Thành tích đọc đa dạng thể loại
//        achievements.add(createAchievement(
//                "Nhà khám phá tri thức",
//                "📔",
//                "Đã mượn sách từ 5 thể loại khác nhau",
//                15
//        ));
//        achievements.add(createAchievement(
//                "Người đọc toàn diện",
//                "📘",
//                "Đã mượn sách từ 10 thể loại khác nhau",
//                30
//        ));
//        achievements.add(createAchievement(
//                "Bách khoa toàn thư sống",
//                "📚",
//                "Đã đọc đủ tất cả thể loại sách trong thư viện",
//                50
//        ));
//
//        // 4. Thành tích về việc giới thiệu thư viện
//        achievements.add(createAchievement(
//                "Người truyền cảm hứng",
//                "👥",
//                "Giới thiệu 5 người bạn mới tham gia thư viện",
//                20
//        ));
//        achievements.add(createAchievement(
//                "Đại sứ thư viện",
//                "📢",
//                "Giới thiệu 20+ người tham gia thư viện",
//                40
//        ));
//
//        // 5. Thành tích tham gia hoạt động thư viện
//        achievements.add(createAchievement(
//                "Người chia sẻ tri thức",
//                "🎤",
//                "Đã tham gia 3 buổi thảo luận sách",
//                15
//        ));
//        achievements.add(createAchievement(
//                "Nhà văn tương lai",
//                "🎭",
//                "Đã viết ít nhất 5 bài đánh giá sách",
//                20
//        ));
//        achievements.add(createAchievement(
//                "Nhà nghiên cứu trẻ",
//                "🏅",
//                "Đã tham gia ít nhất 1 hội thảo nghiên cứu của thư viện",
//                15
//        ));
//
//        // 6. Thành tích đặc biệt & danh hiệu
//        achievements.add(createAchievement(
//                "Độc giả của tháng",
//                "🥇",
//                "Được bình chọn là người đọc tích cực nhất tháng",
//                25
//        ));
//        achievements.add(createAchievement(
//                "Độc giả xuất sắc",
//                "🏆",
//                "Mượn nhiều sách nhất năm",
//                50
//        ));
//        achievements.add(createAchievement(
//                "Thành viên VIP",
//                "⭐",
//                "Đạt hạng thành viên cao nhất",
//                75
//        ));
//
//        // Save all achievements
//        achievementRepository.saveAll(achievements);
//    }
//
//    private Achievement createAchievement(String name, String icon, String description, int points) {
//        Achievement achievement = new Achievement();
//        achievement.setAchievementName(name);
//        achievement.setAchievementIcon(icon);
//        achievement.setDescription(description);
//        achievement.setPointsAwarded(points);
//        return achievement;
//    }
//    //endregion
//
//    //region DDCClassification
//        @PostConstruct
//        public void initDDCClassifications() {
//            // Check if classifications already exist to avoid duplicates
//            if (ddcClassificationRepository.count() > 0) {
//                return;
//            }
//
//            List<DDCClassification> classifications = new ArrayList<>();
//
//            classifications.add(createClassification(
//                    "000",
//                    "Tổng quát",
//                    "Bách khoa toàn thư, thư mục và các tài liệu tham khảo chung."
//            ));
//
//            classifications.add(createClassification(
//                    "100",
//                    "Triết học & Tâm lý học",
//                    "Siêu hình học, nhận thức luận, đạo đức học, logic và tâm lý học."
//            ));
//
//            classifications.add(createClassification(
//                    "200",
//                    "Tôn giáo",
//                    "Các tôn giáo trên thế giới, thần thoại và thần học."
//            ));
//
//            classifications.add(createClassification(
//                    "300",
//                    "Khoa học xã hội",
//                    "Xã hội học, nhân học, khoa học chính trị và luật."
//            ));
//
//            classifications.add(createClassification(
//                    "400",
//                    "Ngôn ngữ",
//                    "Ngôn ngữ học, ngữ pháp, từ điển và các ngôn ngữ cụ thể."
//            ));
//
//            classifications.add(createClassification(
//                    "500",
//                    "Khoa học tự nhiên",
//                    "Toán học, vật lý, hóa học, sinh học và thiên văn học."
//            ));
//
//            classifications.add(createClassification(
//                    "600",
//                    "Công nghệ & Khoa học ứng dụng",
//                    "Kỹ thuật, y học, nông nghiệp và quản lý công nghiệp."
//            ));
//
//            classifications.add(createClassification(
//                    "700",
//                    "Nghệ thuật & Giải trí",
//                    "Kiến trúc, điêu khắc, hội họa, âm nhạc và nhiếp ảnh."
//            ));
//
//            classifications.add(createClassification(
//                    "800",
//                    "Văn học",
//                    "Thơ, kịch, tiểu thuyết, phê bình văn học và các thể loại văn học khác."
//            ));
//
//            classifications.add(createClassification(
//                    "900",
//                    "Lịch sử & Địa lý",
//                    "Lịch sử thế giới, địa lý, tiểu sử và du lịch."
//            ));
//
//            // Save all classifications
//            ddcClassificationRepository.saveAll(classifications);
//        }
//
//        private DDCClassification createClassification( String ddcCode, String ddcName, String description) {
//            DDCClassification classification = new DDCClassification();
//            classification.setDDCCode(ddcCode);
//            classification.setDDCName(ddcName);
//            classification.setDescription(description);
//            return classification;
//        }
//        //endregion
//
//    //region Create Default Account
//    @PostConstruct
//    public void initAccount() {
//        if (userRepository.findById("manager").isEmpty()){
//            User user = new User();
//            user.setUserID("manager");
//            user.setFullName("manager");
//            user.setUserType("Manager");
//            user.setStatus("Hoạt dộng");
//            user.setCreatedAt(LocalDate.now());
//            user.setDob(LocalDate.of(2000, 1, 1));
//            user.setExpiry(LocalDate.of(3000, 1, 1));
//            user.setGender("default");
//            user.setUserImage("https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/LogoUTC.jpg/640px-LogoUTC.jpg");
//            user.setNationalID("default");
//            user = userRepository.save(user);
//            AuthCredential authCredential = new AuthCredential();
//            authCredential.setUserID(user);
//            authCredential.setEmail("admin@gmail.com");
//            authCredential.setPasswordHash(passwordEncoder.encode("123456"));
//            authCredentialRepository.save(authCredential);
//            Role role = roleRepository.findByRoleName("Manager");
//            UserRole userRole = new UserRole();
//            userRole.setUser(user);
//            userRole.setRole(role);
//            userRoleRepository.save(userRole);
//        }
//        if (userRepository.findById("coordinator").isEmpty()){
//            User user = new User();
//            user.setUserID("coordinator");
//            user.setFullName("coordinator");
//            user.setUserType("Staff");
//            user.setStatus("Hoạt dộng");
//            user.setCreatedAt(LocalDate.now());
//            user.setDob(LocalDate.of(2000, 1, 1));
//            user.setExpiry(LocalDate.of(3000, 1, 1));
//            user.setGender("default");
//            user.setUserImage("https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/LogoUTC.jpg/640px-LogoUTC.jpg");
//            user.setNationalID("default");
//            user = userRepository.save(user);
//            AuthCredential authCredential = new AuthCredential();
//            authCredential.setUserID(user);
//            authCredential.setEmail("coordinator@gmail.com");
//            authCredential.setPasswordHash(passwordEncoder.encode("123456"));
//            authCredentialRepository.save(authCredential);
//            Role role = roleRepository.findByRoleName("Coordinator");
//            UserRole userRole = new UserRole();
//            userRole.setUser(user);
//            userRole.setRole(role);
//            userRoleRepository.save(userRole);
//        }
//        if (userRepository.findById("librarian").isEmpty()){
//            User user = new User();
//            user.setUserID("librarian");
//            user.setFullName("librarian");
//            user.setUserType("Staff");
//            user.setStatus("Hoạt dộng");
//            user.setCreatedAt(LocalDate.now());
//            user.setDob(LocalDate.of(2000, 1, 1));
//            user.setExpiry(LocalDate.of(3000, 1, 1));
//            user.setGender("default");
//            user.setUserImage("https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/LogoUTC.jpg/640px-LogoUTC.jpg");
//            user.setNationalID("default");
//            user = userRepository.save(user);
//            AuthCredential authCredential = new AuthCredential();
//            authCredential.setUserID(user);
//            authCredential.setEmail("librarian@gmail.com");
//            authCredential.setPasswordHash(passwordEncoder.encode("123456"));
//            authCredentialRepository.save(authCredential);
//            Role role = roleRepository.findByRoleName("Librarian");
//            UserRole userRole = new UserRole();
//            userRole.setUser(user);
//            userRole.setRole(role);
//            userRoleRepository.save(userRole);
//        }
//        if (userRepository.findById("patron").isEmpty()){
//            User user = new User();
//            user.setUserID("patron");
//            user.setFullName("patron");
//            user.setUserType("Patron");
//            user.setStatus("Hoạt dộng");
//            user.setCreatedAt(LocalDate.now());
//            user.setDob(LocalDate.of(2000, 1, 1));
//            user.setExpiry(LocalDate.of(3000, 1, 1));
//            user.setGender("default");
//            user.setMemberPoints(0);
//            user.setUserImage("https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/LogoUTC.jpg/640px-LogoUTC.jpg");
//            user.setNationalID("default");
//            user = userRepository.save(user);
//            AuthCredential authCredential = new AuthCredential();
//            authCredential.setUserID(user);
//            authCredential.setEmail("patron@gmail.com");
//            authCredential.setPasswordHash(passwordEncoder.encode("123456"));
//            authCredentialRepository.save(authCredential);
//            Role role = roleRepository.findByRoleName("patron");
//            UserRole userRole = new UserRole();
//            userRole.setUser(user);
//            userRole.setRole(role);
//            userRoleRepository.save(userRole);
//            Membership membership = new Membership();
//            membership.setUserID(user);
//            membership.setMembershipType("Đồng");
//            membership.setUpdatedAt(Instant.now());
//            membershipRepository.save(membership);
//        }
//    }
//    //endregion
}

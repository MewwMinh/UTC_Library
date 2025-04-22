package edu.utc.demo_01.service;

import edu.utc.demo_01.dto.APIResponse;
import edu.utc.demo_01.dto.manager.request.EmployeeCreateRequest;
import edu.utc.demo_01.dto.manager.request.EmployeeUpdateRequest;
import edu.utc.demo_01.dto.manager.response.EmployeeActivityLog;
import edu.utc.demo_01.dto.manager.response.EmployeeDetails;
import edu.utc.demo_01.dto.manager.response.EmployeeInformation;
import edu.utc.demo_01.dto.manager.setting.*;
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
import org.springframework.web.multipart.MultipartFile;

import java.lang.reflect.Field;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ManagerService {
    CloudinaryService cloudinaryService;
    PasswordEncoder passwordEncoder;
    UserRepository userRepository;
    AuthCredentialRepository authCredentialRepository;
    RoleRepository roleRepository;
    UserRoleRepository userRoleRepository;
    ActivityLogRepository activityLogRepository;
    LibrarySettingRepository librarySettingRepository;


    //region Dashboard

    //endregion

    //region Manage Employee
    public APIResponse<List<EmployeeInformation>> getAllEmployees(){
        return APIResponse.<List<EmployeeInformation>>builder()
                .code(1000)
                .result(userRepository.getAllEmployees())
                .build();
    }

    public APIResponse<EmployeeDetails> getEmployeeByUserID(String userID){
        return APIResponse.<EmployeeDetails>builder()
                .code(1000)
                .result(userRepository.getEmployeeByUserID(userID))
                .build();
    }

    @Transactional
    public APIResponse createEmployee(EmployeeCreateRequest employee){
        String userID = SecurityContextHolder.getContext().getAuthentication().getName();
        if (userID == null) throw new AppException(ErrorCode.CAN_NOT_GET_USER_INFORMATION);
        User manager = userRepository.findByUserID(userID).orElseThrow();

        User e = new User();
        e.setUserID(employee.getUserID());
        e.setFullName(employee.getUserName());
        e.setUserType("Staff");
        e.setStatus("Hoạt động");
        e.setCreatedAt(LocalDate.now());
        e.setDob(employee.getDob());
        e.setGender(employee.getGender());
        e.setUserImage(employee.getUserImage());
        e.setNationalID(employee.getNationalID());
        e = userRepository.save(e);

        AuthCredential ac = new AuthCredential();
        ac.setUserID(e);
        ac.setEmail(employee.getEmail());
        ac.setPasswordHash(passwordEncoder.encode("123456"));
        ac.setLastLogin(LocalDateTime.now());
        authCredentialRepository.save(ac);

        Role role = roleRepository.findByRoleName(employee.getRole());
        UserRole userRole = new UserRole();
        userRole.setRole(role);
        userRole.setUser(e);
        userRoleRepository.save(userRole);

        String msg = "Tạo mới nhân viên " + e.getFullName() + " thành công!!";
        ActivityLog al = new ActivityLog();
        al.setActorID(manager);
        al.setActorRole(role.getRoleName());
        al.setActionType("Thêm mới");
        al.setEntityType("Staff");
        al.setEntityID(e.getUserID());
        al.setActionDetails(msg);
        al.setActionTime(LocalDateTime.now());
        al.setStatus("Thành công");
        activityLogRepository.save(al);

        return APIResponse.builder()
                .code(1000)
                .message(msg)
                .build();
    }

    public APIResponse uploadEmployeeAvatar(MultipartFile avt, String userID) {
        String url = cloudinaryService.uploadEmployeeAvatar(avt, userID);
        return APIResponse.builder()
                .code(1000)
                .message(url)
                .build();
    }

    @Transactional
    public APIResponse updateEmployee(String employeeID, EmployeeUpdateRequest request){
        String userID = SecurityContextHolder.getContext().getAuthentication().getName();
        if (userID == null) throw new AppException(ErrorCode.CAN_NOT_GET_USER_INFORMATION);
        User manager = userRepository.findByUserID(userID).orElseThrow();

        String actionDetails = "";

        User e = userRepository.findByUserID(employeeID).orElseThrow();
        if (!e.getFullName().equals(request.getUserName()))
        {
            actionDetails += "Thay đổi tên từ " + e.getFullName() + " thành " + request.getUserName() + "\n";
            e.setFullName(request.getUserName());
        }

        if (e.getStatus() != null || !e.getStatus().equals(request.getStatus()))
        {
            actionDetails += "Thay đổi trạng thái từ " + e.getStatus() + " thành " + request.getStatus() + "\n";
            e.setStatus(request.getStatus());
        }

        if (!e.getDob().equals(request.getDob()))
        {
            actionDetails += "Thay đổi ngày tháng năm sinh từ " + e.getDob() + " thành " + request.getDob() + "\n";
            e.setDob(request.getDob());
        }

        if (!e.getGender().equals(request.getGender()))
        {
            actionDetails += "Thay đổi giới tính từ " + e.getGender() + " thành " + request.getGender() + "\n";
            e.setGender(request.getGender());
        }

        if (!e.getNationalID().equals(request.getNationalID()))
        {
            actionDetails += "Thay đổi giới CCCD " + e.getNationalID() + " thành " + request.getNationalID() + "\n";
            e.setNationalID(request.getNationalID());
        }

        userRepository.save(e);

        AuthCredential ac = authCredentialRepository.findByUserID(e).orElseThrow();
        if (!ac.getEmail().equals(request.getEmail()))
        {
            actionDetails += "Thay đổi email từ " + ac.getEmail() + " thành " + request.getEmail() + "\n";
            ac.setEmail(request.getEmail());
        }
        authCredentialRepository.save(ac);

        UserRole userRole = userRoleRepository.findByUser(e).orElseThrow();
        if (!userRole.getRole().getRoleName().equals(request.getRole()))
        {
            actionDetails += "Thay đổi tên vai trò " + userRole.getRole().getRoleName() + " thành " + request.getRole() + "\n";
            Role newRole = roleRepository.findByRoleName(request.getRole());
            userRole.setRole(newRole);
        }

        ActivityLog al = new ActivityLog();
        al.setActorID(manager);
        al.setActorRole("MANAGER");
        al.setActionType("Cập nhật");
        al.setEntityType("Staff");
        al.setEntityID(e.getUserID());
        al.setActionDetails(actionDetails);
        al.setActionTime(LocalDateTime.now());
        al.setStatus("Thành công");
        activityLogRepository.save(al);

        return APIResponse.builder()
                .code(1000)
                .message("Chỉnh sửa thông tin cho nhân viên " + e.getFullName() + " thành công!!")
                .build();
    }

    @Transactional
    public APIResponse deleteEmployee(String employeeID){
        String userID = SecurityContextHolder.getContext().getAuthentication().getName();
        if (userID == null) throw new AppException(ErrorCode.CAN_NOT_GET_USER_INFORMATION);
        User manager = userRepository.findByUserID(userID).orElseThrow();
        User e = userRepository.findByUserID(employeeID).orElseThrow();
        userRepository.delete(e);

        String msg = "Xóa nhân viên " + e.getFullName() + " thành công!!";
        ActivityLog al = new ActivityLog();
        al.setActorID(manager);
        al.setActorRole("MANAGER");
        al.setActionType("Xóa");
        al.setEntityType("Staff");
        al.setEntityID(e.getUserID());
        al.setActionDetails(msg);
        al.setActionTime(LocalDateTime.now());
        al.setStatus("Thành công");
        activityLogRepository.save(al);

        return APIResponse.builder()
                .code(1000)
                .message(msg)
                .build();
    }
    //endregion

    //region Configure System
    public static <T> T mapToSetting(List<LibrarySetting> settings, Class<T> clazz) {
        try {
            T instance = clazz.getDeclaredConstructor().newInstance();
            for (LibrarySetting setting : settings) {
                String key = setting.getSettingKey();
                String value = setting.getValue();

                for (Field field : clazz.getDeclaredFields()) {
                    if (field.getName().equalsIgnoreCase(key)) {
                        field.setAccessible(true);
                        field.set(instance, value);
                        break;
                    }
                }
            }
            return instance;
        } catch (Exception e) {
            throw new RuntimeException("Mapping failed", e);
        }
    }

    public APIResponse<LibrarySettings> getAllLibrarySettings() {
        List<LibrarySetting> librarySettings = librarySettingRepository.findAll();
        RewardsAndPenaltiesSettings rewards = mapToSetting(librarySettings, RewardsAndPenaltiesSettings.class);
        LateFeeSettings lateFees = mapToSetting(librarySettings, LateFeeSettings.class);
        BorrowingLimitsSettings limits = mapToSetting(librarySettings, BorrowingLimitsSettings.class);
        BorrowingPeriodSettings periods = mapToSetting(librarySettings, BorrowingPeriodSettings.class);
        LibrarySettings result = new LibrarySettings();
        result.setRewardsAndPenaltiesSettings(rewards);
        result.setLateFeeSettings(lateFees);
        result.setBorrowingLimitsSettings(limits);
        result.setBorrowingPeriodSettings(periods);
        return APIResponse.<LibrarySettings>builder()
                .code(1000)
                .result(result)
                .build();
    }

    public APIResponse rewardsAndPenaltiesSettings(RewardsAndPenaltiesSettings request){
        librarySettingRepository.setSettingValue("BonusPointsForOnTimeBookReturn" ,request.getBonusPointsForOnTimeBookReturn());
        librarySettingRepository.setSettingValue("PointsDeductedForLostBook", request.getPointsDeductedForLostBook());
        librarySettingRepository.setSettingValue("PointsDeductedForDamagedBook", request.getPointsDeductedForDamagedBook());
        librarySettingRepository.setSettingValue("PointsDeductedForLateReferenceMaterialsReturn", request.getPointsDeductedForLateReferenceMaterialsReturn());
        librarySettingRepository.setSettingValue("PointsDeductedForLateTextbookReturn", request.getPointsDeductedForLateTextbookReturn());
        return APIResponse.builder()
                .code(1000)
                .message("Thay đổi Cài đặt điểm thưởng & phạt thành công!! ")
                .build();
    }

    public APIResponse lateFeeSettings(LateFeeSettings request){
        librarySettingRepository.setSettingValue("LateFeeMultiplier_ReferenceMaterials_Over30Days" ,request.getLateFeeMultiplier_ReferenceMaterials_Over30Days());
        librarySettingRepository.setSettingValue("LateFeeMultiplier_Textbook_Over3Months", request.getLateFeeMultiplier_Textbook_Over3Months());
        librarySettingRepository.setSettingValue("LateFeeMultiplier_ReferenceMaterials_Under30Days", request.getLateFeeMultiplier_ReferenceMaterials_Under30Days());
        librarySettingRepository.setSettingValue("LateFeeMultiplier_Textbook_Under3Months", request.getLateFeeMultiplier_Textbook_Under3Months());
        return APIResponse.builder()
                .code(1000)
                .message("Thay đổi Cài đặt phí trễ hạn thành công!! ")
                .build();
    }

    public APIResponse borrowingLimitsSettings(BorrowingLimitsSettings request){
        librarySettingRepository.setSettingValue("MaxReferenceMaterials_BronzeMember" ,request.getMaxReferenceMaterials_BronzeMember());
        librarySettingRepository.setSettingValue("MaxReferenceMaterials_SilverMember", request.getMaxReferenceMaterials_SilverMember());
        librarySettingRepository.setSettingValue("MaxReferenceMaterials_GoldMember", request.getMaxReferenceMaterials_GoldMember());
        librarySettingRepository.setSettingValue("MaxTextbooks_BronzeMember", request.getMaxTextbooks_BronzeMember());
        librarySettingRepository.setSettingValue("MaxTextbooks_SilverMember", request.getMaxTextbooks_SilverMember());
        librarySettingRepository.setSettingValue("MaxTextbooks_GoldMember", request.getMaxTextbooks_GoldMember());
        return APIResponse.builder()
                .code(1000)
                .message("Thay đổi Cài đặt giới hạn mượn sách thành công!! ")
                .build();
    }

    public APIResponse borrowingPeriodSettings(BorrowingPeriodSettings request){
        librarySettingRepository.setSettingValue("MaximumBorrowingPeriodForReferenceMaterials" ,request.getMaximumBorrowingPeriodForReferenceMaterials());
        librarySettingRepository.setSettingValue("Semester1_BorrowEndDate", request.getSemester1_BorrowEndDate());
        librarySettingRepository.setSettingValue("Semester1_BorrowStartDate", request.getSemester1_BorrowStartDate());
        librarySettingRepository.setSettingValue("Semester1_LatestReturnDate", request.getSemester1_LatestReturnDate());
        librarySettingRepository.setSettingValue("Semester2_BorrowEndDate", request.getSemester2_BorrowEndDate());
        librarySettingRepository.setSettingValue("Semester2_BorrowStartDate", request.getSemester2_BorrowStartDate());
        librarySettingRepository.setSettingValue("Semester2_LatestReturnDate", request.getSemester2_LatestReturnDate());
        return APIResponse.builder()
                .code(1000)
                .message("Thay đổi Cài đặt thời gian mượn sách thành công!! ")
                .build();
    }
    //endregion

    //region Activity Log
    public APIResponse<List<EmployeeActivityLog>> getEmployeeActivityLog(){
        return APIResponse.<List<EmployeeActivityLog>>builder()
                .code(1000)
                .result(activityLogRepository.getEmployeeActivityLog())
                .build();
    }
    //endregion

    //region Statistic

    //endregion
}

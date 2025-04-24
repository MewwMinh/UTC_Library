package edu.utc.demo_01.controller;

import edu.utc.demo_01.dto.APIResponse;
import edu.utc.demo_01.dto.auth.UserDetailInformation;
import edu.utc.demo_01.dto.manager.request.EmployeeCreateRequest;
import edu.utc.demo_01.dto.manager.request.EmployeeUpdateRequest;
import edu.utc.demo_01.dto.manager.response.EmployeeActivityLog;
import edu.utc.demo_01.dto.manager.response.EmployeeDetails;
import edu.utc.demo_01.dto.manager.response.EmployeeInformation;
import edu.utc.demo_01.dto.manager.setting.*;
import edu.utc.demo_01.dto.statistics.*;
import edu.utc.demo_01.service.ManagerService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/manager")
@CrossOrigin(origins = {"http://localhost:5173", "https://utc-library.vercel.app"})
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ManagerController {
    ManagerService service;

    //region Dashboard
    @GetMapping("get-details-info")
    public APIResponse<UserDetailInformation> getDetailsInfo(){
        return service.getDetailsInfo();
    }
    //endregion

    //region Manage Employee
    @GetMapping("get-all-employees")
    public APIResponse<List<EmployeeInformation>> getAllEmployees(){
        return service.getAllEmployees();
    }

    @GetMapping("get-employee-by-user-id/{userID}")
    public APIResponse<EmployeeDetails> getEmployeeByUserID(@PathVariable String userID){
        return service.getEmployeeByUserID(userID);
    }

    @PostMapping("create-employee")
    public APIResponse createEmployee(@RequestBody EmployeeCreateRequest employee){
        return service.createEmployee(employee);
    }

    @PostMapping("upload-employee-avatar/{userID}")
    public APIResponse uploadEmployeeAvatar(@PathVariable String userID, @RequestParam("file") MultipartFile avt){
        return service.uploadEmployeeAvatar(avt, userID);
    }

    @PostMapping("update-employee/{employeeID}")
    public APIResponse updateEmployee(@PathVariable String employeeID, @RequestBody EmployeeUpdateRequest employee){
        return service.updateEmployee(employeeID, employee);
    }

    @DeleteMapping("delete-employee/{employeeID}")
    public APIResponse deleteEmployee(@PathVariable String employeeID){
        return service.deleteEmployee(employeeID);
    }
    //endregion

    //region Configure System
    @GetMapping("get-all-library-setting")
    public APIResponse<LibrarySettings> getAllLibrarySettings() {
        return service.getAllLibrarySettings();
    }
    @PostMapping("rewardsAndPenaltiesSettings")
    public APIResponse rewardsAndPenaltiesSettings(@RequestBody RewardsAndPenaltiesSettings request){
        return service.rewardsAndPenaltiesSettings(request);
    }
    @PostMapping("lateFeeSettings")
    public APIResponse lateFeeSettings(@RequestBody LateFeeSettings request){
        return service.lateFeeSettings(request);
    }
    @PostMapping("borrowingLimitsSettings")
    public APIResponse borrowingLimitsSettings(@RequestBody BorrowingLimitsSettings request){
        return service.borrowingLimitsSettings(request);
    }
    @PostMapping("borrowingPeriodSettings")
    public APIResponse borrowingPeriodSettings(@RequestBody BorrowingPeriodSettings request){
        return service.borrowingPeriodSettings(request);
    }
    //endregion

    //region Activity Log
    @GetMapping("get-employee-activity-log")
    public APIResponse<List<EmployeeActivityLog>> getEmployeeActivityLog(){
        return service.getEmployeeActivityLog();
    }
    //endregion

    //region Statistic
    @GetMapping("get-tong-hop-thong-ke")
    public APIResponse<TongHopThongKe> getTongHopThongKe(){
        return service.getTongHopThongKe();
    }

    @GetMapping("get-phan-loai-nguoi-dung")
    public APIResponse<PhanLoaiNguoiDung> getPhanLoaiNguoiDung(){
        return service.getPhanLoaiNguoiDung();
    }

    @GetMapping("get-thong-ke-hang-thanh-vien")
    public APIResponse<ThongKeHangThanhVien> getThongKeHangThanhVien(){
        return service.getThongKeHangThanhVien();
    }

    @GetMapping("get-thong-ke-muon-tra-5-nam-gan-day")
    public APIResponse<List<ThongKeMuonTra5NamGanDay>> getThongKeMuonTra5NamGanDay(){
        return service.getThongKeMuonTra5NamGanDay();
    }

    @GetMapping("get-thong-ke-muon-tra-theo-nam/{year}")
    public APIResponse<List<ThongKeMuonTraTheoNam>> getThongKeMuonTraTheoNam(@PathVariable int year){
        return service.getThongKeMuonTraTheoNam(year);
    }

    @GetMapping("get-thong-ke-nhu-cau-su-dung-thu-vien-theo-nam/{year}")
    public APIResponse<List<ThongKeNhuCauSuDungThuVienTheoNam>> getThongKeNhuCauSuDungThuVienTheoNam(@PathVariable int year){
        return service.getThongKeNhuCauSuDungThuVienTheoNam(year);
    }

    @GetMapping("get-thong-ke-nhu-cau-su-dung-thu-vien-theo-thang/{year}/{month}")
    public APIResponse<List<ThongKeNhuCauSuDungThuVienTheoThang>> getThongKeNhuCauSuDungThuVienTheoThang(@PathVariable int year, @PathVariable int month){
        return service.getThongKeNhuCauSuDungThuVienTheoThang(year, month);
    }

    @GetMapping("get-top-10-sach-duoc-muon-nhieu-nhat-theo-thang/{year}/{month}")
    public APIResponse<List<Top10SachDuocMuonNhieuNhatTheoThang>> getTop10SachDuocMuonNhieuNhatTheoThang(@PathVariable int year, @PathVariable int month){
        return service.getTop10SachDuocMuonNhieuNhatTheoThang(year, month);
    }

    @GetMapping("/test")
    public boolean test(){
        return service.test();
    }
    //endregion
}

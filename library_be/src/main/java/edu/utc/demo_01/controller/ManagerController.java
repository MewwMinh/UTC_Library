package edu.utc.demo_01.controller;

import edu.utc.demo_01.dto.APIResponse;
import edu.utc.demo_01.dto.manager.request.EmployeeCreateRequest;
import edu.utc.demo_01.dto.manager.request.EmployeeUpdateRequest;
import edu.utc.demo_01.dto.manager.response.EmployeeActivityLog;
import edu.utc.demo_01.dto.manager.response.EmployeeDetails;
import edu.utc.demo_01.dto.manager.response.EmployeeInformation;
import edu.utc.demo_01.dto.manager.setting.*;
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

    //endregion
}

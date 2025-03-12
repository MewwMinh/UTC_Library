package edu.utc.demo_01.controller;

import edu.utc.demo_01.dto.staff.support_staff.reponse.ChangeMembershipTierResponse;
import edu.utc.demo_01.dto.staff.support_staff.reponse.UserRequestDetailResponse;
import edu.utc.demo_01.dto.staff.support_staff.reponse.UserRequestResponse;
import edu.utc.demo_01.dto.staff.support_staff.reponse.UserResponse;
import edu.utc.demo_01.dto.staff.support_staff.request.ChangeMembershipTierRequest;
import edu.utc.demo_01.dto.staff.support_staff.request.CreateResponseRequest;
import edu.utc.demo_01.dto.staff.support_staff.request.CreateUserRequest;
import edu.utc.demo_01.service.SupportStaffService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/sp")
@CrossOrigin(origins = "http://localhost:3000")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class SupportStaffController {
    SupportStaffService service;
    @GetMapping()
    List<UserResponse> getAllUsers() {
        return service.getAllUsers();
    }

    @PatchMapping("/change_membership_tier")
    ChangeMembershipTierResponse changeMembershipTier(@RequestBody ChangeMembershipTierRequest request){
        ChangeMembershipTierResponse response = service.changeMembershipTier(request);
        return response;
    }
    @GetMapping("/reset_password/{id}")
    String resetUserPassword(@PathVariable String id){
        return service.resetUserPassword(id);
    }
    @GetMapping("create_user_in_utc/{id}")
    boolean createUserInUTC(@PathVariable String id){
        return service.createUserInUTC(id);
    }
    @PostMapping("create_user")
    boolean createUser(@RequestBody CreateUserRequest request){
        return service.createUser(request);
    }

    @GetMapping("get_all_support_request")
    List<UserRequestResponse> allSupportRequest(){
        return service.getAllUserRequests();
    }

    @GetMapping("get_support_request_by_id/{id}")
    UserRequestDetailResponse getSupportRequestByID(@PathVariable String id){
        return service.getSupportRequestDetail(id);
    }

    @PostMapping("response_user_request")
    boolean responseUserRequest(@RequestBody CreateResponseRequest request){
        return service.responseUserRequest(request);
    }
}

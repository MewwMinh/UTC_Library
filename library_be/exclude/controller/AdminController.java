package edu.utc.demo_01.controller;

import edu.utc.demo_01.dto.admin.request.CreateStaffRequest;
import edu.utc.demo_01.dto.admin.request.SetStaffStatusRequest;
import edu.utc.demo_01.dto.admin.response.*;
import edu.utc.demo_01.service.AdminService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin")
@CrossOrigin(origins = "http://localhost:3000")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AdminController {
    AdminService service;
    @PostMapping("create_staff")
    boolean createStaff(@RequestBody CreateStaffRequest request){
        return service.createStaff(request);
    }
    @PatchMapping("set_staff_status")
    boolean setStaffStatus(@RequestBody SetStaffStatusRequest request){
        return service.setStaffStatus(request);
    }

    @GetMapping("reset_staff_password/{id}")
    String resetStaffPassword(@PathVariable String id){
        return service.resetStaffPassword(id);
    }

    @GetMapping("get_all_staff")
    List<StaffReponse> getAllStaff(){
        return service.getAllStaff();
    }

    @GetMapping("get_quantity_of_user_by_membership")
    QuantityOfUserByMembershipTier getQuantityOfUserByMembershipTier(){
        return service.getQuantityOfUserByMembershipTier();
    }

    @GetMapping("get_quantity_of_user_by_role")
    QuantityOfUserByRole getQuantityOfUserByRole(){
        return service.getQuantityOfUserByRole();
    }

    @GetMapping("get_quantity_of_user")
    QuantityUsersReponse getQuantityUsers(){
        return service.getQuantityUsersSTT();
    }

    @GetMapping("get_quantity_of_book")
    QuantityOfBook getQuantityOfBook(){
        return service.getQuantityOfBook();
    }

    @GetMapping("get_quantity_of_over_due_book")
    QuantityOfOverDueBook getQuantityOfOverDueBook(){
        return service.getQuantityOfOverDueBook();
    }
}

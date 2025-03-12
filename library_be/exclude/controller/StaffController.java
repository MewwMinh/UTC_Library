package edu.utc.demo_01.controller;

import edu.utc.demo_01.dto.staff.common.response.StaffInformationResponse;
import edu.utc.demo_01.service.StaffService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/staff")
@CrossOrigin(origins = "http://localhost:3000")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class StaffController {
    StaffService service;
    @GetMapping("get_staff_information/{id}")
    StaffInformationResponse getStaffInformation(@PathVariable String id){
        return service.getStaffInformation(id);
    }
}

package edu.utc.demo_01.controller;

import edu.utc.demo_01.dto.coordinator.request.CreatePatron;
import edu.utc.demo_01.service.CoordinatorService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/coordinator")
@CrossOrigin(origins = "http://localhost:5173")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class CoordinatorController {
    CoordinatorService service;
    @PostMapping("create_user")
    boolean createUser(@RequestBody CreatePatron request) {
        service.createPatron(request);
        return true;
    }
}

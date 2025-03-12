package edu.utc.demo_01.controller;

import edu.utc.demo_01.dto.staff.librarian.request.BorrowBookRequest;
import edu.utc.demo_01.dto.staff.librarian.request.CreateEventRequest;
import edu.utc.demo_01.dto.staff.librarian.request.CreateViolationRequest;
import edu.utc.demo_01.dto.staff.librarian.response.EventParticipantReponse;
import edu.utc.demo_01.dto.staff.librarian.response.ViolationResponse;
import edu.utc.demo_01.service.LibrarianService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/librarian")
@CrossOrigin(origins = "http://localhost:3000")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class LibrarianController {
    LibrarianService service;
    @PostMapping("/create_borrow_book")
    boolean createBorrowBook(@RequestBody BorrowBookRequest request){
        return service.createBorrowRecord(request);
    }
    @PatchMapping("/return_book")
    boolean cc(@RequestBody BorrowBookRequest request){
        return service.returnBook(request);
    }
    @PostMapping("create_violation_record")
    boolean createViolationRecord(@RequestBody CreateViolationRequest request){
        return service.createViolationRecord(request);
    }
    @GetMapping("get_all_violations")
    public List<ViolationResponse> getAllViolations(){
        return service.getAllViolations();
    }
    @PostMapping("create_event")
    boolean createEvent(@RequestBody CreateEventRequest request){
        return service.createEvent(request);
    }
    @GetMapping("get_participant_by_event_id/{id}")
    List<EventParticipantReponse> getParticipantByEventID(@PathVariable String id){
        return service.getParticipantByEventID(id);
    }
}

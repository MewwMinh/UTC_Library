package edu.utc.demo_01.controller;

import edu.utc.demo_01.dto.APIResponse;
import edu.utc.demo_01.dto.coordinator.request.ChangeEventInformation;
import edu.utc.demo_01.dto.coordinator.request.ChangePatronInformation;
import edu.utc.demo_01.dto.coordinator.request.CreatePatron;
import edu.utc.demo_01.dto.coordinator.request.ResponseTicket;
import edu.utc.demo_01.dto.coordinator.response.*;
import edu.utc.demo_01.dto.patron.response.BorrowBookResponse2;
import edu.utc.demo_01.dto.patron.response.ViolationsResponse;
import edu.utc.demo_01.service.CoordinatorService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/coordinator")
@CrossOrigin(origins = {"http://localhost:5173", "https://utc-library.vercel.app"})
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class CoordinatorController {
    CoordinatorService service;

    @PostMapping("reset_patron_password/{id}")
    boolean changePw(@PathVariable String id) {
        service.resetPatronPassword(id);
        return true;
    }
    @PostMapping("response-ticket")
    boolean responseTicket(@RequestBody ResponseTicket request) {
        return service.responseTicket(request);
    }

    //region Manage Reading Room
    @GetMapping("get-patrons-in-reading-room")
    public APIResponse<List<PatronInReadingRoom>> getPatronInReadingRoom(){
        return service.getPatronInReadingRoom();
    }
    @PostMapping("check-in-patron/{patronID}")
    public APIResponse checkInPatron(@PathVariable String patronID){
        return service.checkInPatron(patronID);
    }
    @PostMapping("check-out-patron/{recordID}")
    public APIResponse checkOutPatron(@PathVariable String recordID){
        return service.checkOutPatron(recordID);
    }
    //endregion

    //region Manage Patron
    @GetMapping("get-all-patrons")
    public APIResponse<List<PatronResponse>> getAllPatrons() {
        return service.getAllPatrons();
    }
    @GetMapping("get-patron-detail-by-id/{userID}")
    public APIResponse<PatronDetailsResponse> getPatronDetailsByUserID(@PathVariable String userID) {
        return service.getPatronDetailsByUserID(userID);
    }
    @GetMapping("get-patron-borrow-records-history/{patronID}")
    public APIResponse<List<BorrowBookResponse2>> getPatronBorrowRecordsHistory(@PathVariable String patronID){
        return service.getPatronBorrowRecordsHistory(patronID);
    }
    @GetMapping("get-patron-violations/{patronID}")
    APIResponse<List<ViolationsResponse>> getPatronViolations(@PathVariable String patronID) {
        return service.getPatronViolations(patronID);
    }
    @GetMapping("get-patron-using-reading-room-history/{patronID}")
    public APIResponse<List<UsingReadingRoomResponse>> getPatronUsingReadingRoomHistory(@PathVariable String patronID){
        return service.getPatronUsingReadingRoomHistory(patronID);
    }
    @PostMapping("change-patron-infomation")
    public APIResponse changePatronInformation(@RequestBody ChangePatronInformation request){
        return service.changePatronInformation(request);
    }
    @PostMapping("create_patron")
    APIResponse createPatron(@RequestBody CreatePatron request) {
        return service.createPatron(request);
    }
    //endregion

    //region Manage Event
    @GetMapping("get-all-events")
    public APIResponse<List<EventResponse>> getAllEvents(){
        return service.getAllEvents();
    }
    @GetMapping("get-event-by-event-id/{eventID}")
    public APIResponse<EventResponse> getEventByEventID(@PathVariable String eventID) {
        return service.getEventByEventID(eventID);
    }
    @PostMapping("change-event-infomation/{eventID}")
    public APIResponse changeEventInfomation(@PathVariable String eventID, @RequestBody ChangeEventInformation request){
        return service.changeEventInfomation(eventID, request);
    }
    @DeleteMapping("delete-event/{eventID}")
    public APIResponse deleteEvent(@PathVariable String eventID) {
        return service.deleteEventByEventID(eventID);
    }
    @PostMapping("create-event")
    public APIResponse createEvent(@RequestBody ChangeEventInformation request) {
        return service.createEvent(request);
    }
    @GetMapping("get-all-patron-registed/{eventID}")
    public APIResponse<List<PatronRegisted>> getAllPatronRegisted(@PathVariable String eventID){
        return service.getAllPatronRegisted(eventID);
    }
    //endregion
}

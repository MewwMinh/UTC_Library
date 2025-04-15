package edu.utc.demo_01.controller;

import edu.utc.demo_01.dto.APIResponse;
import edu.utc.demo_01.dto.auth.AuthenticationRequest;
import edu.utc.demo_01.dto.auth.AuthenticationResponse;
import edu.utc.demo_01.dto.auth.CommonInformation;
import edu.utc.demo_01.dto.auth.Token;
import edu.utc.demo_01.service.AuthenticationService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = {"http://localhost:5173", "https://utc-library.vercel.app"})
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AuthenticationController {
    AuthenticationService service;
    @PostMapping("login")
    public APIResponse<AuthenticationResponse> login(@RequestBody AuthenticationRequest request) {
        return service.authenticate(request);
    }
    @PostMapping("refresh-token")
    public APIResponse<AuthenticationResponse> refreshToken(@RequestBody Token request) {
        return service.refreshToken(request.getToken());
    }
    @PostMapping("introspect/{token}")
    public boolean introspect(@PathVariable String token) {
        return service.introspect(token);
    }
    @GetMapping("get-common-information")
    public APIResponse<CommonInformation> getCommonInformation() {
        return service.getCommonInformation();
    }
    @PostMapping("log-out")
    public boolean logout(@RequestBody Token request) {
        return service.logout(request);
    }
}

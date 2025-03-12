package edu.utc.demo_01.service;

import com.nimbusds.jose.*;
import com.nimbusds.jose.crypto.MACSigner;
import com.nimbusds.jose.crypto.MACVerifier;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;
import edu.utc.demo_01.dto.APIResponse;
import edu.utc.demo_01.dto.auth.AuthenticationRequest;
import edu.utc.demo_01.dto.auth.AuthenticationResponse;
import edu.utc.demo_01.dto.auth.CommonInformation;
import edu.utc.demo_01.dto.auth.Token;
import edu.utc.demo_01.entity.AuthCredential;
import edu.utc.demo_01.entity.InvalidToken;
import edu.utc.demo_01.entity.User;
import edu.utc.demo_01.entity.UserRole;
import edu.utc.demo_01.exception.AppException;
import edu.utc.demo_01.exception.ErrorCode;
import edu.utc.demo_01.repository.*;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.text.ParseException;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AuthenticationService {
    private final RoleRepository roleRepository;
    @NonFinal
    @Value("${jwt.signer-key}")
    protected String SIGNER_KEY;

    @NonFinal
    @Value("${jwt.access-token-expiration}")
    protected int ACCESS_TOKEN_EXPIRATION;

    @NonFinal
    @Value("${jwt.refresh-token-expiration}")
    protected int REFRESH_TOKEN_EXPIRATION;

    UserRepository userRepository;
    AuthCredentialRepository authCredentialRepository;
    UserRoleRepository userRoleRepository;
    InvalidTokenRepository invalidTokenRepository;

    public APIResponse<AuthenticationResponse> authenticate(AuthenticationRequest request) {
        User user = userRepository.findById(request.getUsername()).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
        AuthCredential credential = authCredentialRepository.findByUserID(user).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
        PasswordEncoder passwordEncoder = new BCryptPasswordEncoder(10);
        boolean authenticated =  passwordEncoder.matches(request.getPassword(), credential.getPasswordHash());
        if (!authenticated) throw new AppException(ErrorCode.WRONG_PASSWORD);
        var token = generateToken(credential, false);
        var refreshToken = generateToken(credential, true);
        return APIResponse.<AuthenticationResponse>builder()
                .code(1000)
                .result(AuthenticationResponse.builder()
                        .token(token)
                        .refreshToken(refreshToken)
                        .build())
                .build();
    }

    public APIResponse<AuthenticationResponse> refreshToken(String refreshToken) {
        try {
            // Kiểm tra refresh token có hợp lệ không
            JWSVerifier verifier = new MACVerifier(SIGNER_KEY.getBytes());
            SignedJWT signedJWT = SignedJWT.parse(refreshToken);
            Date expiryTime = signedJWT.getJWTClaimsSet().getExpirationTime();
            boolean verified = signedJWT.verify(verifier);

            if (!verified || expiryTime.before(new Date())) {
                throw new AppException(ErrorCode.SESSION_HAS_EXPIRED);
            }

            // Lấy thông tin user từ refresh token
            String userID = signedJWT.getJWTClaimsSet().getSubject();
            User user = userRepository.findByUserID(userID)
                    .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

            // Lấy thông tin đăng nhập của user
            AuthCredential credential = authCredentialRepository.findByUserID(user)
                    .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

            // Tạo access token mới
            String newAccessToken = generateToken(credential, false);

            // Trả về access token mới, giữ nguyên refresh token cũ
            return APIResponse.<AuthenticationResponse>builder()
                    .code(1000)
                    .result(AuthenticationResponse.builder()
                            .token(newAccessToken)
                            .refreshToken(refreshToken)
                            .build())
                    .build();

        } catch (JOSEException | ParseException e) {
            throw new AppException(ErrorCode.UNCATEGORIZED_EXCEPTION);
        }
    }

    public APIResponse<CommonInformation> getCommonInformation() {
        String userID = SecurityContextHolder.getContext().getAuthentication().getName();
        if (userID == null) throw new AppException(ErrorCode.CAN_NOT_GET_USER_INFORMATION);
        User user = userRepository.findByUserID(userID).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        CommonInformation result = CommonInformation.builder()
                .userID(user.getUserID())
                .userName(user.getFullName())
                .userImage(user.getUserImage())
                .build();
        return APIResponse.<CommonInformation>builder()
                .code(1000)
                .result(result)
                .build();
    }

    public boolean introspect(String token) {
        try {
            JWSVerifier verifier = new MACVerifier(SIGNER_KEY.getBytes());
            SignedJWT signedJWT = SignedJWT.parse(token);
            Date expiryTime = signedJWT.getJWTClaimsSet().getExpirationTime();
            var verified = signedJWT.verify(verifier);

            return verified && expiryTime.after(new Date());
        } catch (JOSEException | ParseException e) {
            throw new RuntimeException(e);
        }
    }

    public boolean logout(Token request) {
        System.out.print(request.getToken());
        try {
            SignedJWT signedJWT = SignedJWT.parse(request.getToken());
            String jwtID = signedJWT.getJWTClaimsSet().getJWTID();
            Date expiry = signedJWT.getJWTClaimsSet().getExpirationTime();
            invalidTokenRepository.save(new InvalidToken(jwtID, expiry));
            return true;
        } catch (ParseException e) {
            throw new RuntimeException(e);
        }
    }

    private String generateToken(AuthCredential user, boolean isRefresh) {
        JWSHeader header = new JWSHeader(JWSAlgorithm.HS512);

        UserRole userRole = userRoleRepository.findByUser(user.getUserID()).orElseThrow(() -> new AppException(ErrorCode.CAN_NOT_CREATE_TOKEN));

        JWTClaimsSet jwtClaimsSet;

        if (isRefresh) {
            jwtClaimsSet = new JWTClaimsSet.Builder()
                    .subject(user.getUserID().getUserID())
                    .issuer("utc")
                    .issueTime(new Date())
                    .expirationTime(new Date(Instant.now().plus(REFRESH_TOKEN_EXPIRATION, ChronoUnit.DAYS).toEpochMilli()))
                    .claim("scope", userRole.getRole().getRoleName())
                    .build();
        } else {
            jwtClaimsSet = new JWTClaimsSet.Builder()
                    .subject(user.getUserID().getUserID())
                    .issuer("utc")
                    .issueTime(new Date())
                    .expirationTime(new Date(Instant.now().plus(ACCESS_TOKEN_EXPIRATION, ChronoUnit.HOURS).toEpochMilli()))
                    .jwtID(UUID.randomUUID().toString())
                    .claim("scope", userRole.getRole().getRoleName())
                    .build();
        }

        Payload payload = new Payload(jwtClaimsSet.toJSONObject());

        JWSObject jwsObject = new JWSObject(header, payload);

        try {
            jwsObject.sign(new MACSigner(SIGNER_KEY.getBytes()));
            return jwsObject.serialize();
        } catch (JOSEException e) {
            throw new RuntimeException();
        }
    }

}

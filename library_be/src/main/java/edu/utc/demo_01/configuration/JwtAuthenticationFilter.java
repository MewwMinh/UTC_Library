package edu.utc.demo_01.configuration;

import edu.utc.demo_01.entity.InvalidToken;
import edu.utc.demo_01.exception.AppException;
import edu.utc.demo_01.exception.ErrorCode;
import edu.utc.demo_01.repository.InvalidTokenRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Optional;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    @Autowired
    private InvalidTokenRepository invalidTokenRepository;

    @Autowired
    private JwtDecoder jwtDecoder;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        String token = extractJwtFromRequest(request);

        if (token != null) {
            try {
                Jwt jwt = jwtDecoder.decode(token);
                String jwtId = jwt.getId();

                // Kiểm tra xem token có trong danh sách bị vô hiệu hóa không
                Optional<InvalidToken> invalidToken = invalidTokenRepository.findById(jwtId);
                if (invalidToken.isPresent()) {
                    // Token đã bị vô hiệu hóa
                    SecurityContextHolder.clearContext();
//                    response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
//                    response.getWriter().write("Token has been invalidated");
                    throw new AppException(ErrorCode.TOKEN_HAS_EXPIRED);
//                    return;
                }

                // Tiếp tục chuỗi filter
            } catch (Exception e) {
                throw new AppException(ErrorCode.UNCATEGORIZED_EXCEPTION);
                // Token không hợp lệ
            }
        }

        filterChain.doFilter(request, response);
    }

    private String extractJwtFromRequest(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }
}

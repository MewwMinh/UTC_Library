package edu.utc.demo_01.service;

import edu.utc.demo_01.repository.InvalidTokenRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;

@Service
@RequiredArgsConstructor
public class TokenCleanupService {

    private final InvalidTokenRepository invalidTokenRepository;
    @Transactional
    @Scheduled(fixedRate = 24 * 60 * 60 * 1000) // Chạy mỗi ngày
    public void cleanupExpiredTokens() {
        Date now = new Date();
        invalidTokenRepository.deleteAllByExpiryBefore(now);
    }
}

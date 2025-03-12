package edu.utc.demo_01.repository;

import edu.utc.demo_01.entity.InvalidToken;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Date;

public interface InvalidTokenRepository extends JpaRepository<InvalidToken, String> {
    boolean existsByTokenID(String tokenID);
    void deleteAllByExpiryBefore(Date date);
}
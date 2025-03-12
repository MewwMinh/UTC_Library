package edu.utc.demo_01.repository;

import edu.utc.demo_01.entity.AuthCredential;
import edu.utc.demo_01.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AuthCredentialRepository extends JpaRepository<AuthCredential, String> {
    Optional<AuthCredential> findByUserID(User userID);
}
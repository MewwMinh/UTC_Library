package edu.utc.demo_01.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AuthCredentialRepository extends JpaRepository<AuthCredential, String> {
    Optional<AuthCredential> findByUser(User user);
}
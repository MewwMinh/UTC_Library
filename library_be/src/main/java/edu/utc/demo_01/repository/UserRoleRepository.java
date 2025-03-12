package edu.utc.demo_01.repository;

import edu.utc.demo_01.entity.User;
import edu.utc.demo_01.entity.UserRole;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRoleRepository extends JpaRepository<UserRole, String> {
    Optional<UserRole> findByUser(User user);
}
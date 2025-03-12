package edu.utc.demo_01.repository;

import edu.utc.demo_01.entity.User;
import edu.utc.demo_01.entity.UserViolation;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserViolationRepository extends JpaRepository<UserViolation, String> {
    int countByUserID(User userID);
}
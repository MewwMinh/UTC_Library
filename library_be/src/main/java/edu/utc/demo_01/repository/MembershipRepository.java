package edu.utc.demo_01.repository;

import edu.utc.demo_01.entity.Membership;
import edu.utc.demo_01.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MembershipRepository extends JpaRepository<Membership, String> {
    Membership findByUserID(User userID);
}
package edu.utc.demo_01.repository;

import edu.utc.demo_01.entity.Membership;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MembershipRepository extends JpaRepository<Membership, String> {
}
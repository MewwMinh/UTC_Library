package edu.utc.demo_01.repository;

import edu.utc.demo_01.dto.admin.response.QuantityOfUserByMembershipTier;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface MembershipRepository extends JpaRepository<Membership, String> {
    Optional<Membership> findByUserID(User user);
        @Query(value = """
        SELECT MembershipType
        FROM Memberships
        WHERE UserID = :id
    """, nativeQuery = true)
    String getMembershipTierByUserID(@Param("id") String id);
    @Query(value = """
        SELECT SUM(CASE WHEN MembershipType = 'ĐỒNG' THEN 1 ELSE 0 END) AS TotalDong,
               SUM(CASE WHEN MembershipType = 'BẠC' THEN 1 ELSE 0 END) AS TotalBac,
               SUM(CASE WHEN MembershipType = 'VÀNG' THEN 1 ELSE 0 END) AS TotalVang
        FROM Memberships
    """, nativeQuery = true)
    QuantityOfUserByMembershipTier getQuantityOfUserByMembershipTier();
}
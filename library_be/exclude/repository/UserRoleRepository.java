package edu.utc.demo_01.repository;

import edu.utc.demo_01.dto.admin.response.QuantityOfUserByMembershipTier;
import edu.utc.demo_01.dto.admin.response.QuantityOfUserByRole;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRoleRepository extends JpaRepository<UserRole, String> {
    @Query(value = """
        SELECT SUM(CASE WHEN r.RoleName = 'Teacher' THEN 1 ELSE 0 END) AS TotalTeachers,
               SUM(CASE WHEN r.RoleName = 'Student' THEN 1 ELSE 0 END) AS TotalStudents,
               SUM(CASE WHEN r.RoleName = 'Researcher' THEN 1 ELSE 0 END) AS TotalResearchers
        FROM UserRoles ur
        JOIN Roles r ON ur.RoleID = r.RoleID
        WHERE r.RoleName IN ('Teacher', 'Student', 'Researcher');
    """, nativeQuery = true)
    QuantityOfUserByRole getQuantityOfUserByRole();
}
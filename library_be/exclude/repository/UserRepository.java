package edu.utc.demo_01.repository;

import edu.utc.demo_01.dto.admin.response.QuantityUsersReponse;
import edu.utc.demo_01.dto.admin.response.StaffReponse;
import edu.utc.demo_01.dto.staff.common.response.StaffInformationResponse;
import edu.utc.demo_01.dto.staff.support_staff.reponse.UserResponse;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, String> {
    @Query(value = """
        SELECT u.FullName, ac.Email, r.RoleName, m.MembershipType
        FROM Users u
        JOIN UserRoles ur ON u.UserId = ur.UserId
        JOIN Roles r ON ur.RoleId = r.RoleId
        JOIN AuthCredentials ac ON u.UserId = ac.UserId
        JOIN Memberships m ON u.UserId = m.UserId
        WHERE u.userType = 'USER' AND u.Status = 'ACTIVE'
    """, nativeQuery = true)
    List<UserResponse> getAllUsers();
    Optional<User> findById(String id);
//    @Query(value = """
//        SELECT m.MembershipType
//        FROM Users u
//        JOIN Memberships m ON u.UserId = m.UserId
//        WHERE u.userType = 'USER' AND u.Status = 'ACTIVE'
//    """, nativeQuery = true)
//    String getMembershipTier(@Param("id") String id);
    @Query(value = """
            SELECT u.FullName, ac.Email, r.RoleName, u.status
            FROM Users u
            JOIN UserRoles ur ON u.UserId = ur.UserId
            JOIN Roles r ON ur.RoleId = r.RoleId
            JOIN AuthCredentials ac ON u.UserId = ac.UserId
            WHERE u.userType = 'STAFF'
        """, nativeQuery = true)
    List<StaffReponse> getAllStaff();
    @Query(value = """
            SELECT  u.UserID AS staffID,
                    u.FullName AS fullName,
                    u.userType AS userType,
                    u.Status AS status,
                    u.CreatedAt AS createdAt,
                    ac.Email AS email, 
                    r.RoleName AS roleName
            FROM Users u
            JOIN UserRoles ur ON u.UserID = ur.UserID
            JOIN Roles r ON ur.RoleID = r.RoleID
            JOIN AuthCredentials ac ON u.UserID = ac.UserID
            WHERE u.UserID = :id
        """, nativeQuery = true)
    StaffInformationResponse getStaffByID(@Param("id") String id);
    @Query(value = """
        SELECT COUNT(CASE WHEN UserType = 'STAFF' AND Status = 'ACTIVE' THEN 1 END) AS TotalActiveStaff,
                   COUNT(CASE WHEN UserType = 'STAFF' AND Status = 'INACTIVE' THEN 1 END) AS TotalInactiveStaff,
                   COUNT(CASE WHEN UserType = 'USER' THEN 1 END) AS TotalUsers,
                   COUNT(CASE WHEN UserType = 'USER' AND Status = 'ACTIVE' THEN 1 END) AS TotalActiveUsers,
                   COUNT(CASE WHEN UserType = 'USER' AND Status = 'INACTIVE' THEN 1 END) AS TotalInactiveUsers,
                   COUNT(CASE WHEN UserType = 'USER' AND Status = 'BANNED' THEN 1 END) AS TotalBannedUsers
        FROM Users
    """, nativeQuery = true)
    QuantityUsersReponse getQuantityUsersReponse();
}
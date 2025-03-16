package edu.utc.demo_01.repository;

import edu.utc.demo_01.dto.patron.response.PatronInformation;
import edu.utc.demo_01.dto.patron.response.TopPatronReponse;
import edu.utc.demo_01.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, String> {
    Optional<User> findByUserID(String userID);

    @Query(value = """
        SELECT u.UserID AS userID,
                       u.FullName AS userName,
                       u.Gender AS gender,
                       u.MemberPoints AS memberPoints,
                       u.UserImage AS userImage,
                       u.DOB AS dateOfBirth,
                       u.CreatedAt AS creationDate,
                       u.Expiry AS expirationDate,
                       r.RoleName AS role,
                       ac.Email AS email,
                       m.MembershipType AS membershipType
                FROM Users u
                JOIN UserRoles ur ON u.UserId = ur.UserId
                JOIN Roles r ON ur.RoleId = r.RoleId
                JOIN AuthCredentials ac ON u.UserId = ac.UserId
                JOIN Memberships m ON u.UserId = m.UserId
        		WHERE u.UserID = :userID
    """, nativeQuery = true)
    Optional<PatronInformation> getPatronInformationByUserID(@Param("userID") String userID);

    @Query(value = """
        SELECT FullName AS patronName,
               MemberPoints AS memberPoints,
               MembershipType AS membershipType,
               UserImage AS userImage        
        FROM Users u
        JOIN Memberships m ON u.UserId = m.UserId       
        ORDER BY MemberPoints DESC 
        LIMIT 10
        """, nativeQuery = true)
    List<TopPatronReponse> findTop10ByMemberPoints();

    @Query(value = """
        SELECT *        
        FROM Users      
        WHERE UserType = 'Patron'
        """, nativeQuery = true)
    List<User> findAllPatron();
    @Query(value = """
        SELECT u.UserID AS userID,
                       u.FullName AS fullName,
                       u.Gender AS gender,
                       u.UserType AS userType,
                       u.Status AS status,
                       u.createdAt AS createdAt,
                       u.DOB AS dob,
                       u.Expiry AS expiry,   
                       u.MemberPoints AS memberPoints,
                       u.UserImage AS userImage,
                       u.NationalID AS nationalID
                FROM Users u
                JOIN UserRoles ur ON u.UserId = ur.UserId
                JOIN Roles r ON ur.RoleId = r.RoleId
        		WHERE r.RoleName = 'Librarian'
    """, nativeQuery = true)
    List<User> findAllLibrarian();
    @Query(value = """
        SELECT u.UserID AS userID,
                       u.FullName AS fullName,
                       u.Gender AS gender,
                       u.UserType AS userType,
                       u.Status AS status,
                       u.createdAt AS createdAt,
                       u.DOB AS dob,
                       u.Expiry AS expiry,   
                       u.MemberPoints AS memberPoints,
                       u.UserImage AS userImage,
                       u.NationalID AS nationalID
                FROM Users u
                JOIN UserRoles ur ON u.UserId = ur.UserId
                JOIN Roles r ON ur.RoleId = r.RoleId
        		WHERE r.RoleName = 'Coordinator'
    """, nativeQuery = true)
    List<User> findAllCoordinator();
}
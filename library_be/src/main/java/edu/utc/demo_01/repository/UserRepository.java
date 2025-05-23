package edu.utc.demo_01.repository;

import edu.utc.demo_01.dto.coordinator.response.PatronDetailsResponse;
import edu.utc.demo_01.dto.coordinator.response.PatronResponse;
import edu.utc.demo_01.dto.manager.response.EmployeeDetails;
import edu.utc.demo_01.dto.manager.response.EmployeeInformation;
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
                       u.Status AS status,    
                       r.Description AS role,
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

    @Query(value = """
        SELECT
            u.UserID AS patronID,
            u.FullName AS patronName,
            u.UserImage AS patronImage,
            ac.Email AS patronEmail,
            m.MembershipType AS membershipType,
            u.MemberPoints AS memberPoints,
            u.Status AS patronStatus                 
        FROM
            Users u                 
        JOIN
            AuthCredentials ac 
                ON u.UserID = ac.UserID                 
        JOIN
            Memberships m 
                ON u.UserID = m.UserID           
        WHERE
            u.UserType = 'Patron'
    """, nativeQuery = true)
    List<PatronResponse> getAllPatrons();

    @Query(value = """
        SELECT
            u.UserID AS patronID,
            u.FullName AS patronName,
            u.UserImage AS patronImage,
            ac.Email AS patronEmail,
            m.MembershipType AS membershipType,
            u.MemberPoints AS memberPoints,
            u.Status AS patronStatus,
            u.CreatedAt AS createdAt,
            u.Expiry AS expiry,
            u.DOB AS dob,
            u.Gender AS gender,
            r.RoleName AS role   
        FROM
            Users u                 
        JOIN
            AuthCredentials ac 
                ON u.UserID = ac.UserID                 
        JOIN
            Memberships m 
                ON u.UserID = m.UserID
        JOIN UserRoles ur ON u.UserId = ur.UserId
                JOIN Roles r ON ur.RoleId = r.RoleId    
        WHERE
            u.UserID = :userID
            
    """, nativeQuery = true)
    PatronDetailsResponse getPatronDetailsByUserID(@Param("userID") String userID);

    boolean existsByUserID(String userID);

    @Query(value = """
        SELECT
            u.UserID AS userID,
            u.FullName AS userName,
            u.UserImage AS userImage,
            u.Gender AS gender,
            u.Status AS status,    
            ac.Email AS patronEmail,
            r.RoleName AS role                 
        FROM
            Users u                 
        JOIN
            AuthCredentials ac 
                ON u.UserID = ac.UserID                 
        JOIN UserRoles ur ON u.UserId = ur.UserId
                JOIN Roles r ON ur.RoleId = r.RoleId           
        WHERE
            u.UserType = 'Staff'
    """, nativeQuery = true)
    List<EmployeeInformation> getAllEmployees();

    @Query(value = """
        SELECT
            u.UserID AS userID,
            u.FullName AS userName,
            u.UserImage AS userImage,
            u.Gender AS gender,
            u.Status AS status,    
            ac.Email AS patronEmail,
            r.RoleName AS role,
            u.CreatedAt AS createAt,
            u.DOB AS dob,
            u.NationalID AS nationalID,
            ac.LastLogin AS lastLoginAt  
        FROM
            Users u                 
        JOIN
            AuthCredentials ac 
                ON u.UserID = ac.UserID                 
        JOIN UserRoles ur ON u.UserId = ur.UserId
                JOIN Roles r ON ur.RoleId = r.RoleId           
        WHERE
            u.UserID = :userID
    """, nativeQuery = true)
    EmployeeDetails getEmployeeByUserID(@Param("userID") String userID);
}
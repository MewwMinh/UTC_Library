package edu.utc.demo_01.repository;

import edu.utc.demo_01.dto.auth.response.GetAllCategoryResponse;
import edu.utc.demo_01.dto.staff.support_staff.reponse.UserResponse;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface CategoryRepository extends JpaRepository<Category, String> {
    Optional<Category> findByCategoryID(String categoryID);
    @Query(value = """
        SELECT u.FullName, ac.Email, r.RoleName, m.MembershipType
        FROM Users u
        JOIN UserRoles ur ON u.UserId = ur.UserId
        JOIN Roles r ON ur.RoleId = r.RoleId
        JOIN AuthCredentials ac ON u.UserId = ac.UserId
        JOIN Memberships m ON u.UserId = m.UserId
        WHERE u.userType = 'USER' AND u.Status = 'ACTIVE'
    """, nativeQuery = true)
    List<GetAllCategoryResponse> getAllCategory();
}
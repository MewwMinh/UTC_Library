package edu.utc.demo_01.repository;

import edu.utc.demo_01.dto.manager.response.EmployeeActivityLog;
import edu.utc.demo_01.entity.ActivityLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ActivityLogRepository extends JpaRepository<ActivityLog, String> {
    @Query(value = """
        SELECT
            a.LogID AS logID,   
            u.UserID AS userID,
            u.FullName AS userName,
            u.UserImage AS userImage,
            a.ActorRole AS userRole,
            a.ActionType AS actionType,
            a.EntityType AS entityType,    
            a.EntityID AS entityID,
            a.ActionDetails AS actionDetails,
            a.ActionTime AS actionTime,
            a.Status AS status  
        FROM
            ActivityLog a                 
        JOIN
            Users u 
                ON u.UserID = a.ActorID                    
        ORDER BY actionTime DESC
            
    """, nativeQuery = true)
    List<EmployeeActivityLog> getEmployeeActivityLog();
}
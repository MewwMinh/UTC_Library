package edu.utc.demo_01.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.hibernate.annotations.DynamicInsert;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
@DynamicInsert
//@Entity
public class UTCDatabase {
    @Id
    @Column(name = "UserID", nullable = false, length = 9)
    private String userID;

    @Column(name = "UserName", length = 50)
    private String userName;

    @Column(name = "Email", length = 150)
    private String email;

    @Column(name = "RoleName", length = 30)
    private String roleName;
}
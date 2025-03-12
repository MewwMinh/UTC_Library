package edu.utc.demo_01.entity;

import edu.utc.demo_01.enums.UserStatus;
import edu.utc.demo_01.enums.UserType;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.hibernate.annotations.DynamicInsert;

import java.sql.Date;
import java.time.LocalDate;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
@DynamicInsert
//@Entity
@Table(name = "Users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "UserID")
    private String id;

    @Column(name = "FullName", nullable = false)
    private String fullName;

    @Enumerated(EnumType.STRING)
    @Column(name = "UserType", nullable = false)
    private UserType userType;

    @Enumerated(EnumType.STRING)
    @Column(name = "Status")
    private UserStatus userStatus;

    @Column(name = "CreatedAt")
    private Date createdAt;
}
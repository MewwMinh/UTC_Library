package edu.utc.demo_01.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.DynamicInsert;

import java.time.LocalDate;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
@DynamicInsert
@Entity
@Table(name = "Users")
public class User {
    @Id
    @Column(name = "UserID", nullable = false, length = 36)
    private String userID;

    @Column(name = "FullName", nullable = false)
    private String fullName;

    @Column(name = "UserType", nullable = false, length = 50)
    private String userType;

    @ColumnDefault("'ACTIVE'")
    @Column(name = "Status", length = 50)
    private String status;

    @ColumnDefault("(curdate())")
    @Column(name = "CreatedAt")
    private LocalDate createdAt;

    @Column(name = "DOB")
    private LocalDate dob;

    @Column(name = "Gender", nullable = false, length = 10)
    private String gender;

    @Column(name = "Expiry")
    private LocalDate expiry;

    @ColumnDefault("0")
    @Column(name = "MemberPoints")
    private Integer memberPoints;

    @Column(name = "UserImage")
    private String userImage;

    @Column(name = "NationalID", length = 20)
    private String nationalID;

}
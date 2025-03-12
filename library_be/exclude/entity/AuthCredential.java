package edu.utc.demo_01.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.sql.Timestamp;
import java.time.LocalDateTime;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
@DynamicInsert
//@Entity
@Table(name = "AuthCredentials")
public class AuthCredential {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "AuthID", nullable = false)
    String id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "UserID", nullable = false)
    User user;

    @Column(name = "Email", nullable = false)
    String email;

    @Column(name = "PasswordHash", nullable = false)
    String passwordHash;

    @Column(name = "LastLogin")
    Timestamp lastLogin;
}
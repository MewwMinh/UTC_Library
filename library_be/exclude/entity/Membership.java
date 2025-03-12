package edu.utc.demo_01.entity;

import edu.utc.demo_01.enums.MembershipTier;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.sql.Timestamp;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
@DynamicInsert
//@Entity
@Table(name = "Memberships")
public class Membership {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "MembershipID", nullable = false, length = 36)
    private String membershipID;

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "UserID", nullable = false)
    private User userID;

    @Enumerated(EnumType.STRING)
    @Column(name = "MembershipType", nullable = false)
    private MembershipTier membershipType;

    @Column(name = "UpdatedAt")
    private Timestamp updatedAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @OnDelete(action = OnDeleteAction.SET_NULL)
    @JoinColumn(name = "UpdateBy")
    private User updateBy;

}
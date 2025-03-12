package edu.utc.demo_01.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.time.Instant;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
@DynamicInsert
@Entity
@Table(name = "Memberships")
public class Membership {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Size(max = 36)
    @Column(name = "MembershipID", nullable = false, length = 36)
    private String membershipID;

    @NotNull
    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "UserID", nullable = false)
    private User userID;

    @Size(max = 50)
    @NotNull
    @ColumnDefault("'ĐỒNG'")
    @Column(name = "MembershipType", nullable = false, length = 50)
    private String membershipType;

    @ColumnDefault("CURRENT_TIMESTAMP")
    @Column(name = "UpdatedAt")
    private Instant updatedAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @OnDelete(action = OnDeleteAction.SET_NULL)
    @JoinColumn(name = "UpdateBy")
    private User updateBy;

}
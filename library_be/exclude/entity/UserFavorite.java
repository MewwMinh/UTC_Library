package edu.utc.demo_01.entity;

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
@Table(name = "UserFavorites")
public class UserFavorite {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "UserFavoritesID", nullable = false, length = 36)
    private String userFavoritesID;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "UserID", nullable = false)
    private User userID;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "BookID", nullable = false)
    private Book bookID;

    @Column(name = "CreatedAt")
    private Timestamp createdAt;

}
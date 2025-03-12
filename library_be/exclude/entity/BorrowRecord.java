package edu.utc.demo_01.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.sql.Timestamp;
import java.time.Instant;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
@DynamicInsert
//@Entity
@Table(name = "BorrowRecords")
public class BorrowRecord {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "RecordID", nullable = false, length = 36)
    private String recordID;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "UserID", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "BookID", nullable = false)
    private Book bookID;

    @ColumnDefault("CURRENT_TIMESTAMP")
    @Column(name = "BorrowDate", nullable = false)
    private Timestamp borrowDate;

    @Column(name = "DueDate", nullable = false)
    private Timestamp dueDate;

    @Column(name = "ReturnDate")
    private Timestamp returnDate;

}
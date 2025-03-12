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
@Table(name = "BorrowRecords")
public class BorrowRecord {
    @Id
    @Size(max = 36)
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "RecordID", nullable = false, length = 36)
    private String recordID;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "UserID", nullable = false)
    private User userID;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "BookID", nullable = false)
    private Book bookID;

    @NotNull
    @ColumnDefault("CURRENT_TIMESTAMP")
    @Column(name = "BorrowDate", nullable = false)
    private Instant borrowDate;

    @NotNull
    @Column(name = "DueDate", nullable = false)
    private Instant dueDate;

    @ColumnDefault("0")
    @Column(name = "ExtendCount")
    private Integer extendCount;

    @Column(name = "ExtendedDate")
    private Instant extendedDate;

    @ManyToOne(fetch = FetchType.LAZY)
    @OnDelete(action = OnDeleteAction.SET_NULL)
    @JoinColumn(name = "ApprovedBy")
    private User approvedBy;

    @ManyToOne(fetch = FetchType.LAZY)
    @OnDelete(action = OnDeleteAction.SET_NULL)
    @JoinColumn(name = "ReturnApprovedBy")
    private User returnApprovedBy;

    @Column(name = "ReturnDate")
    private Instant returnDate;

}
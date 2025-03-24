package edu.utc.demo_01.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.DynamicInsert;

import java.time.Instant;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
@DynamicInsert
@Entity
@Table(name = "RecentTransactions")
public class RecentTransaction {
    @Id
    @Size(max = 36)
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "TransactionID", nullable = false, length = 36)
    private String transactionID;

    @Size(max = 36)
    @NotNull
    @Column(name = "RecordID", nullable = false, length = 36)
    private String recordID;

    @Size(max = 100)
    @NotNull
    @Column(name = "Patron", nullable = false, length = 100)
    private String patron;

    @Size(max = 100)
    @NotNull
    @Column(name = "Action", nullable = false, length = 100)
    private String action;

    @Size(max = 255)
    @NotNull
    @Column(name = "BookName", nullable = false)
    private String bookName;

    @ColumnDefault("CURRENT_TIMESTAMP")
    @Column(name = "TransactionTime")
    private Instant transactionTime;

}
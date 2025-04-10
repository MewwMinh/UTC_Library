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

import java.time.LocalDate;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
@DynamicInsert
@Entity
@Table(name = "BookItems")
public class BookItem {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Size(max = 36)
    @Column(name = "ItemID", nullable = false, length = 36)
    private String itemID;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "BookID", nullable = false)
    private Book bookID;

    @Size(max = 50)
    @NotNull
    @Column(name = "Barcode", nullable = false, length = 50)
    private String barcode;

    @Size(max = 50)
    @NotNull
    @ColumnDefault("'Có sẵn'")
    @Column(name = "Status", nullable = false, length = 50)
    private String status;

    @Column(name = "AcquisitionDate")
    private LocalDate acquisitionDate;

    @Size(max = 100)
    @Column(name = "Location", length = 100)
    private String location;

    @Size(max = 50)
    @Column(name = "BookCondition", length = 50)
    private String bookCondition;

    @Column(name = "Notes")
    private String notes;

}
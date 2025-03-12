package edu.utc.demo_01.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.hibernate.annotations.DynamicInsert;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
@DynamicInsert
//@Entity
@Table(name = "Books")
public class Book {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "BookID", nullable = false, length = 36)
    private String bookID;

    @Column(name = "Title", nullable = false)
    private String title;

    @Column(name = "Author", nullable = false)
    private String author;

    @Column(name = "ISBN", nullable = false, length = 20)
    private String isbn;

    @Column(name = "TotalCopies", nullable = false)
    private Integer totalCopies;

    @Column(name = "AvailableCopies", nullable = false)
    private Integer availableCopies;

}
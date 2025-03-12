package edu.utc.demo_01.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.DynamicInsert;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
@DynamicInsert
@Entity
@Table(name = "Books")
public class Book {
    @Id
    @Size(max = 36)
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "BookID", nullable = false, length = 36)
    private String bookID;

    @Size(max = 255)
    @NotNull
    @Column(name = "BookName", nullable = false)
    private String bookName;

    @Size(max = 255)
    @NotNull
    @Column(name = "Author", nullable = false)
    private String author;

    @Size(max = 50)
    @ColumnDefault("'Giáo trình'")
    @Column(name = "BookType", length = 50)
    private String bookType;

    @Size(max = 20)
    @NotNull
    @Column(name = "ISBN", nullable = false, length = 20)
    private String isbn;

    @NotNull
    @Column(name = "TotalCopies", nullable = false)
    private Integer totalCopies;

    @NotNull
    @Column(name = "AvailableCopies", nullable = false)
    private Integer availableCopies;

    @Column(name = "PublicationYear")
    private Integer publicationYear;

    @Size(max = 50)
    @ColumnDefault("'Tiếng Việt'")
    @Column(name = "Language", length = 50)
    private String language;

    @Column(name = "PageCount")
    private Integer pageCount;

    @Size(max = 50)
    @Column(name = "Format", length = 50)
    private String format;

    @Column(name = "Description")
    private String description;

    @Size(max = 255)
    @Column(name = "CoverImage")
    private String coverImage;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "DDCCode", referencedColumnName = "DDCCode")
    private DDCClassification dDCCode;

}
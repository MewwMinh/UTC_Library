package edu.utc.demo_01.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.hibernate.annotations.DynamicInsert;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
@DynamicInsert
@Entity
public class DDCClassification {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Size(max = 36)
    @Column(name = "ClassificationID", nullable = false, length = 36)
    private String classificationID;

    @Size(max = 20)
    @NotNull
    @Column(name = "DDCCode", nullable = false, length = 20)
    private String dDCCode;

    @Size(max = 255)
    @NotNull
    @Column(name = "DDCName", nullable = false)
    private String ddcName;

    @Column(name = "Description")
    private String description;

}
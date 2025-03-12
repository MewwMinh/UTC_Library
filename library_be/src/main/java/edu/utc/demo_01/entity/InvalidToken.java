package edu.utc.demo_01.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.hibernate.annotations.DynamicInsert;

import java.util.Date;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
@DynamicInsert
@Entity
@Table(name = "InvalidToken")
public class InvalidToken {
    @Id
    @Size(max = 36)
    @Column(name = "TokenID", nullable = false, length = 36)
    private String tokenID;

    @NotNull
    @Column(name = "Expiry", nullable = false)
    private Date expiry;

}
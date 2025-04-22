package edu.utc.demo_01.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.time.LocalDateTime;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
@DynamicInsert
@Entity
@Table(name = "LibrarySettings")
public class LibrarySetting {
    @Id
    @Size(max = 255)
    @Column(name = "SettingKey", nullable = false)
    private String settingKey;

    @Size(max = 255)
    @NotNull
    @Column(name = "Value", nullable = false)
    private String value;

    @ManyToOne(fetch = FetchType.LAZY)
    @OnDelete(action = OnDeleteAction.SET_NULL)
    @JoinColumn(name = "UpdateBy")
    private User updateBy;

    @Column(name = "UpdateAt")
    private LocalDateTime updateAt;

}
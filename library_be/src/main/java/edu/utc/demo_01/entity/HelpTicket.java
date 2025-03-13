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
@Table(name = "HelpTickets")
public class HelpTicket {
    @Id
    @Size(max = 36)
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "TicketID", nullable = false, length = 36)
    private String ticketID;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "UserID", nullable = false)
    private User userID;

    @Size(max = 255)
    @NotNull
    @Column(name = "Problem", nullable = false)
    private String problem;

    @NotNull
    @Column(name = "Description", nullable = false)
    private String description;

    @Size(max = 50)
    @ColumnDefault("'PENDING'")
    @Column(name = "Status", length = 50)
    private String status;

    @ColumnDefault("(now())")
    @Column(name = "CreatedAt")
    private Instant createdAt;

}
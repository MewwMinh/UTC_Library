package edu.utc.demo_01.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.time.LocalDateTime;

@Getter
@Setter
@Entity
@Table(name = "TicketResponses")
public class TicketResponse {
    @Id
    @Size(max = 36)
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "TicketResponseID", nullable = false, length = 36)
    private String ticketResponseID;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "TicketID", nullable = false)
    private HelpTicket ticketID;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "StaffID", nullable = false)
    private User staffID;

    @Size(max = 255)
    @NotNull
    @Column(name = "Title", nullable = false)
    private String title;

    @NotNull
    @Column(name = "ResponseText", nullable = false)
    private String responseText;

    @ColumnDefault("(now())")
    @Column(name = "CreatedAt")
    private LocalDateTime createdAt;

}
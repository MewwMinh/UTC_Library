package edu.utc.demo_01.repository;

import edu.utc.demo_01.entity.EventParticipant;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EventParticipantRepository extends JpaRepository<EventParticipant, String> {
}
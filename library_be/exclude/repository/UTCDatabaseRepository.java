package edu.utc.demo_01.repository;

import org.springframework.data.jpa.repository.JpaRepository;

public interface UTCDatabaseRepository extends JpaRepository<UTCDatabase, String> {
}
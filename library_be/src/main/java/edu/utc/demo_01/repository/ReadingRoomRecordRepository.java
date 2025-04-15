package edu.utc.demo_01.repository;

import edu.utc.demo_01.entity.ReadingRoomRecord;
import edu.utc.demo_01.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface ReadingRoomRecordRepository extends JpaRepository<ReadingRoomRecord, String> {
    Optional<ReadingRoomRecord> findByRecordID(String recordID);

    List<ReadingRoomRecord> findReadingRoomRecordByUserIDOrderByCheckInTimeDesc(User userID);

    @Query("SELECT r FROM ReadingRoomRecord r WHERE r.checkOutTime IS NULL")
    List<ReadingRoomRecord> findAllActiveUsers();
}
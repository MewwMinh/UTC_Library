package edu.utc.demo_01.repository;

import edu.utc.demo_01.entity.LibrarySetting;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface LibrarySettingRepository extends JpaRepository<LibrarySetting, String> {
    @Query(value = """
        SELECT Value    
        FROM LibrarySettings
        WHERE SettingKey = :settingKey
    """, nativeQuery = true)
    String getSettingValue(@Param("settingKey") String settingKey);
}
package edu.utc.demo_01.repository;

import edu.utc.demo_01.entity.LibrarySetting;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface LibrarySettingRepository extends JpaRepository<LibrarySetting, String> {
    @Query(value = """
        SELECT Value    
        FROM LibrarySettings
        WHERE SettingKey = :settingKey
    """, nativeQuery = true)
    String getSettingValue(@Param("settingKey") String settingKey);

    List<LibrarySetting> findAll();

    @Modifying
    @Transactional
    @Query(value = """
    UPDATE LibrarySettings 
    SET Value = :value 
    WHERE SettingKey = :settingKey
""", nativeQuery = true)
    int setSettingValue(
            @Param("settingKey") String settingKey,
            @Param("value") String value
    );

}
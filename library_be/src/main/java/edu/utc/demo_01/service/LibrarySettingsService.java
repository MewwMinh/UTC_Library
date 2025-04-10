package edu.utc.demo_01.service;

import edu.utc.demo_01.repository.LibrarySettingRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class LibrarySettingsService {
    LibrarySettingRepository librarySettingRepository;

    public int getMaxReferenceMaterials(String membershipType){
        String settingKey = "maxReferenceMaterials_" + membershipType + "Member";
        return Integer.parseInt(librarySettingRepository.getSettingValue(settingKey));
    }
    public int getMaxTextbooks(String membershipType){
        String settingKey = "maxTextbooks_" + membershipType + "Member";
        return Integer.parseInt(librarySettingRepository.getSettingValue(settingKey));
    }
    public float getLateFeeMultiplier_Textbook_Under3Months(){
        return Float.parseFloat(librarySettingRepository.getSettingValue("LateFeeMultiplier_Textbook_Under3Months"));
    }
    public float getLateFeeMultiplier_Textbook_Over3Months(){
        return Float.parseFloat(librarySettingRepository.getSettingValue("LateFeeMultiplier_Textbook_Over3Months"));
    }
    public float getLateFeeMultiplier_ReferenceMaterials_Under30Days(){
        return Float.parseFloat(librarySettingRepository.getSettingValue("LateFeeMultiplier_ReferenceMaterials_Under30Days"));
    }
    public float getLateFeeMultiplier_ReferenceMaterials_Over30Days(){
        return Float.parseFloat(librarySettingRepository.getSettingValue("LateFeeMultiplier_ReferenceMaterials_Over30Days"));
    }
    public LocalDate getSemester1_BorrowDate(String startOrEnd){
        String mmDD = librarySettingRepository.getSettingValue("Semester1_Borrow" + startOrEnd + "Date");
        String yyyyMMdd = LocalDate.now().getYear() + "-" + mmDD;
        return LocalDate.parse(yyyyMMdd, DateTimeFormatter.ofPattern("yyyy-MM-dd"));
    }
    public LocalDate getSemester1_LatestReturnDate(){
        String mmDD = librarySettingRepository.getSettingValue("Semester1_LatestReturnDate");
        String yyyyMMdd = LocalDate.now().plusYears(1).getYear() + "-" + mmDD;
        return LocalDate.parse(yyyyMMdd, DateTimeFormatter.ofPattern("yyyy-MM-dd"));
    }
    public LocalDate getSemester2_LatestReturnDate(boolean isNewYear){
        String mmDD = librarySettingRepository.getSettingValue("Semester2_LatestReturnDate");
        String yyyyMMdd;
        if (isNewYear){
            yyyyMMdd = LocalDate.now().getYear() + "-" + mmDD;
        }
        else {
            yyyyMMdd = LocalDate.now().plusYears(1).getYear() + "-" + mmDD;
        }
        return LocalDate.parse(yyyyMMdd, DateTimeFormatter.ofPattern("yyyy-MM-dd"));
    }
    public int getMaximumBorrowingPeriodForReferenceMaterials(){
        return Integer.parseInt(librarySettingRepository.getSettingValue("MaximumBorrowingPeriodForReferenceMaterials"));
    }
    public int getPointsDeductedForLateReferenceMaterialsReturn(){
        return Integer.parseInt(librarySettingRepository.getSettingValue("PointsDeductedForLateReferenceMaterialsReturn"));
    }
    public int getPointsDeductedForLateTextbookReturn(){
        return Integer.parseInt(librarySettingRepository.getSettingValue("PointsDeductedForLateTextbookReturn"));
    }
    public int getBonusPointsForOnTimeBookReturn(){
        return Integer.parseInt(librarySettingRepository.getSettingValue("BonusPointsForOnTimeBookReturn"));
    }
    public int getPointsDeductedFor(String key){
        String settingKey =  "PointsDeductedFor" + key;
        return Integer.parseInt(librarySettingRepository.getSettingValue(settingKey));
    }

}

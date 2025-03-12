package edu.utc.demo_01.service;

import edu.utc.demo_01.dto.staff.common.response.StaffInformationResponse;
import edu.utc.demo_01.repository.UserRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class StaffService {
    UserRepository userRepository;
    public StaffInformationResponse getStaffInformation(String id){
        return userRepository.getStaffByID(id);
    }
}

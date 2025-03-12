package edu.utc.demo_01.configuration;

import edu.utc.demo_01.entity.AuthCredential;
import edu.utc.demo_01.entity.Role;
import edu.utc.demo_01.entity.User;
import edu.utc.demo_01.entity.UserRole;
import edu.utc.demo_01.repository.AuthCredentialRepository;
import edu.utc.demo_01.repository.RoleRepository;
import edu.utc.demo_01.repository.UserRepository;
import edu.utc.demo_01.repository.UserRoleRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ApplicationInitConfig {
    PasswordEncoder passwordEncoder;
    UserRepository userRepository;
    AuthCredentialRepository authCredentialRepository;
    UserRoleRepository userRoleRepository;
    RoleRepository roleRepository;
    @Bean
    ApplicationRunner applicationRunner() {
        return args -> {
            if (userRepository.findById("admin").isEmpty()){
                User user = new User();
                user.setUserID("admin");
                user.setFullName("admin");
                user.setUserType("Manager");
                user.setGender("Nam");
                user = userRepository.save(user);
                AuthCredential authCredential = new AuthCredential();
                authCredential.setUserID(user);
                authCredential.setEmail("admin@gmail.com");
                authCredential.setPasswordHash(passwordEncoder.encode("123456"));
                authCredentialRepository.save(authCredential);
                Role role = roleRepository.findByRoleName("Manager");
                UserRole userRole = new UserRole();
                userRole.setUser(user);
                userRole.setRole(role);
                userRoleRepository.save(userRole);
            }
            if (userRepository.findById("coordinator").isEmpty()){
                User user = new User();
                user.setUserID("coordinator");
                user.setFullName("coordinator");
                user.setUserType("Staff");
                user.setGender("Nam");
                user = userRepository.save(user);
                AuthCredential authCredential = new AuthCredential();
                authCredential.setUserID(user);
                authCredential.setEmail("coordinator@gmail.com");
                authCredential.setPasswordHash(passwordEncoder.encode("123456"));
                authCredentialRepository.save(authCredential);
                Role role = roleRepository.findByRoleName("Coordinator");
                UserRole userRole = new UserRole();
                userRole.setUser(user);
                userRole.setRole(role);
                userRoleRepository.save(userRole);
            }
            if (userRepository.findById("librarian").isEmpty()){
                User user = new User();
                user.setUserID("librarian");
                user.setFullName("librarian");
                user.setUserType("Staff");
                user.setGender("Nam");
                user = userRepository.save(user);
                AuthCredential authCredential = new AuthCredential();
                authCredential.setUserID(user);
                authCredential.setEmail("librarian@gmail.com");
                authCredential.setPasswordHash(passwordEncoder.encode("123456"));
                authCredentialRepository.save(authCredential);
                Role role = roleRepository.findByRoleName("Librarian");
                UserRole userRole = new UserRole();
                userRole.setUser(user);
                userRole.setRole(role);
                userRoleRepository.save(userRole);
            }
        };
    }
}

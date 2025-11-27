package com.agrizen.auth.config;

import com.agrizen.auth.entity.User;
import com.agrizen.auth.model.Role;
import com.agrizen.auth.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Locale;

@Component
public class DataInitializer implements CommandLineRunner {

	private final UserRepository userRepository;
	private final BCryptPasswordEncoder passwordEncoder;

	public DataInitializer(UserRepository userRepository, BCryptPasswordEncoder passwordEncoder) {
		this.userRepository = userRepository;
		this.passwordEncoder = passwordEncoder;
	}

    @Override
    public void run(String... args) {
        // Ensure admin user exists
        String adminEmail = "admin@agrizen.com";
        if (!userRepository.existsByEmail(adminEmail)) {
            User admin = new User();
            admin.setName("Admin");
            admin.setEmail(adminEmail.toLowerCase(Locale.ROOT));
            admin.setPassword(passwordEncoder.encode("admin"));
            admin.setRole(Role.ADMIN);
            userRepository.save(admin);
            System.out.println("Admin user created: admin@agrizen.com");
        } else {
            userRepository.findByEmail(adminEmail.toLowerCase(Locale.ROOT))
                    .ifPresent(u -> {
                        u.setPassword(passwordEncoder.encode("admin"));
                        userRepository.save(u);
                    });
            System.out.println("Admin user already exists");
        }
    }
}


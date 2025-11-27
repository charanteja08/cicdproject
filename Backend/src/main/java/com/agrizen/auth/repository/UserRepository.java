package com.agrizen.auth.repository;

import com.agrizen.auth.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
	Optional<User> findByEmail(String email);
	boolean existsByEmail(String email);
	Optional<User> findByMobileNumber(String mobileNumber);
	boolean existsByMobileNumber(String mobileNumber);
}



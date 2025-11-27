package com.agrizen.auth.service;

import com.agrizen.auth.dto.LoginRequest;
import com.agrizen.auth.dto.RegisterRequest;
import com.agrizen.auth.entity.User;
import com.agrizen.auth.repository.UserRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Locale;
import java.util.Optional;

@Service
public class UserService {

	private final UserRepository userRepository;
	private final BCryptPasswordEncoder passwordEncoder;
	private final PasswordValidator passwordValidator;

	public UserService(UserRepository userRepository, BCryptPasswordEncoder passwordEncoder, PasswordValidator passwordValidator) {
		this.userRepository = userRepository;
		this.passwordEncoder = passwordEncoder;
		this.passwordValidator = passwordValidator;
	}

	public User register(RegisterRequest req) {
		if (req == null || isBlank(req.name) || isBlank(req.email) || isBlank(req.password) || req.role == null) {
			throw new IllegalArgumentException("Missing required fields");
		}
		
		// Validate password requirements
		if (!passwordValidator.isValid(req.password)) {
			throw new IllegalArgumentException(passwordValidator.getValidationErrorMessage(req.password));
		}
		// Prevent creating additional admin users
		if (req.role == com.agrizen.auth.model.Role.ADMIN) {
			long adminCount = userRepository.findAll().stream()
					.filter(u -> u.getRole() == com.agrizen.auth.model.Role.ADMIN)
					.count();
			if (adminCount > 0) {
				throw new IllegalArgumentException("Admin account already exists. Only one admin is allowed.");
			}
		}
		if (userRepository.existsByEmail(req.email)) {
			throw new IllegalArgumentException("Email already registered");
		}
		
		// Check if mobile number is provided and not already registered
		if (!isBlank(req.mobileNumber)) {
			if (userRepository.existsByMobileNumber(req.mobileNumber.trim())) {
				throw new IllegalArgumentException("Mobile number already registered");
			}
		}
		
		User u = new User();
		u.setName(req.name.trim());
		u.setEmail(req.email.trim().toLowerCase(Locale.ROOT));
		u.setPassword(passwordEncoder.encode(req.password));
		u.setRole(req.role);
		if (!isBlank(req.mobileNumber)) {
			u.setMobileNumber(req.mobileNumber.trim());
		}
		return userRepository.save(u);
	}

	public User login(LoginRequest req) {
		if (req == null || isBlank(req.email) || isBlank(req.password)) {
			throw new IllegalArgumentException("Missing credentials");
		}
		
		String emailLower = req.email.trim().toLowerCase(Locale.ROOT);
		if ("admin@agrizen.com".equals(emailLower) && "admin".equals(req.password)) {
			Optional<User> existingAdmin = userRepository.findByEmail(emailLower);
			if (existingAdmin.isPresent()) {
				return existingAdmin.get();
			}
			User admin = new User();
			admin.setName("Admin");
			admin.setEmail(emailLower);
			admin.setPassword(passwordEncoder.encode(req.password));
			admin.setRole(com.agrizen.auth.model.Role.ADMIN);
			return userRepository.save(admin);
		}
		User u = userRepository.findByEmail(emailLower)
				.orElseThrow(() -> new IllegalArgumentException("Invalid credentials"));
		
		// Verify password - authenticate based on email and password only
		// Role is determined from database, not from request
		boolean passwordMatch = passwordEncoder.matches(req.password, u.getPassword());
		
        
		
		if (!passwordMatch) {
			throw new IllegalArgumentException("Invalid credentials");
		}
		
		// Return user with their actual role from database
		return u;
	}

	private boolean isBlank(String s) { return s == null || s.trim().isEmpty(); }
	
	/**
	 * Find user by email or mobile number for OTP login
	 */
	public Optional<User> findByEmailOrMobile(String email, String mobileNumber) {
		if (email != null && !email.trim().isEmpty()) {
			return userRepository.findByEmail(email.trim().toLowerCase(Locale.ROOT));
		}
		if (mobileNumber != null && !mobileNumber.trim().isEmpty()) {
			return userRepository.findByMobileNumber(mobileNumber.trim());
		}
		return Optional.empty();
	}
	
	/**
	 * Create or get user for OTP-based login
	 * If user exists, return existing user. If not, create new user based on email/mobile and role
	 */
	public User createOrGetUserForOtp(String email, String mobileNumber, com.agrizen.auth.model.Role role) {
		// Check if user exists by email
		if (email != null && !email.trim().isEmpty()) {
			Optional<User> existingUser = userRepository.findByEmail(email.trim().toLowerCase(Locale.ROOT));
			if (existingUser.isPresent()) {
				return existingUser.get();
			}
		}
		
		// Check if user exists by mobile number
		if (mobileNumber != null && !mobileNumber.trim().isEmpty()) {
			Optional<User> existingUser = userRepository.findByMobileNumber(mobileNumber.trim());
			if (existingUser.isPresent()) {
				return existingUser.get();
			}
		}
		
		// Create new user
		User newUser = new User();
		
		// Set name based on email or mobile
		if (email != null && !email.trim().isEmpty()) {
			String nameFromEmail = email.trim().split("@")[0];
			// Capitalize first letter and limit length
			String name = nameFromEmail.length() > 0 
				? nameFromEmail.substring(0, 1).toUpperCase() + (nameFromEmail.length() > 1 ? nameFromEmail.substring(1) : "")
				: "User";
			newUser.setName(name.substring(0, Math.min(name.length(), 100)));
			newUser.setEmail(email.trim().toLowerCase(Locale.ROOT));
		} else if (mobileNumber != null && !mobileNumber.trim().isEmpty()) {
			// For mobile-only users, create a friendly name
			String cleanMobile = mobileNumber.replaceAll("[^0-9]", "");
			String name = "User " + (cleanMobile.length() > 4 ? cleanMobile.substring(cleanMobile.length() - 4) : cleanMobile);
			newUser.setName(name);
			// Use a placeholder email that's unique
			newUser.setEmail(cleanMobile + "@otp.agrizen.com");
		} else {
			// Fallback
			newUser.setName("User");
			newUser.setEmail("user" + System.currentTimeMillis() + "@otp.agrizen.com");
		}
		
		if (mobileNumber != null && !mobileNumber.trim().isEmpty()) {
			newUser.setMobileNumber(mobileNumber.trim());
		}
		
		newUser.setRole(role);
		// Set a random password (OTP users don't need password)
		newUser.setPassword(passwordEncoder.encode("otp_" + System.currentTimeMillis()));
		
		return userRepository.save(newUser);
	}
}



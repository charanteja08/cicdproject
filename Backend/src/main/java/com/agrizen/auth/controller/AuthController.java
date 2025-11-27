package com.agrizen.auth.controller;

import com.agrizen.auth.dto.*;
import com.agrizen.auth.entity.User;
import com.agrizen.auth.model.Role;
import com.agrizen.auth.service.UserService;
import com.agrizen.auth.service.OtpService;
import com.agrizen.farmer.entity.Farmer;
import com.agrizen.farmer.repository.FarmerRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin
public class AuthController {

	private final UserService userService;
	private final OtpService otpService;
	private final FarmerRepository farmerRepository;

	public AuthController(UserService userService, OtpService otpService, FarmerRepository farmerRepository) {
		this.userService = userService;
		this.otpService = otpService;
		this.farmerRepository = farmerRepository;
	}

	@PostMapping("/register")
	public ResponseEntity<AuthResponse> register(@RequestBody RegisterRequest request) {
		try {
			User u = userService.register(request);
			return ResponseEntity.ok(AuthResponse.ok(u.getId(), u.getName(), u.getEmail(), u.getRole()));
		} catch (IllegalArgumentException ex) {
			return ResponseEntity.badRequest().body(AuthResponse.error(ex.getMessage()));
		}
	}

	@PostMapping("/login")
	public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) {
		try {
			User u = userService.login(request);
			return ResponseEntity.ok(AuthResponse.ok(u.getId(), u.getName(), u.getEmail(), u.getRole()));
		} catch (IllegalArgumentException ex) {
			return ResponseEntity.badRequest().body(AuthResponse.error(ex.getMessage()));
		}
	}

	@GetMapping("/ping")
	public ResponseEntity<Object> ping() {
		return ResponseEntity.ok().body(java.util.Map.of("ok", true, "env", "backend"));
	}
	
	@PostMapping("/otp/send")
	public ResponseEntity<OtpResponse> sendOtp(@RequestBody OtpRequest request) {
		try {
			// Clean up expired OTPs
			otpService.cleanupExpiredOtps();
			
			String type = request.type != null ? request.type.toLowerCase() : "";
			String role = request.role != null ? request.role.toUpperCase() : "BUYER";
			boolean sent = false;
			String message = "";
			
			// Validate role
			try {
				Role.valueOf(role);
			} catch (IllegalArgumentException e) {
				System.err.println("Invalid role: " + role);
				return ResponseEntity.badRequest().body(OtpResponse.error("Invalid role. Use 'FARMER' or 'BUYER'"));
			}
			
			// Don't allow admin role via OTP
			if ("ADMIN".equals(role)) {
				return ResponseEntity.badRequest().body(OtpResponse.error("Admin role cannot be used for OTP login"));
			}
			
			if ("email".equals(type)) {
				if (request.email == null || request.email.trim().isEmpty()) {
					return ResponseEntity.badRequest().body(OtpResponse.error("Email is required"));
				}
				
				String email = request.email.trim().toLowerCase();
				
				// No need to check if user exists - OTP login works for new and existing users
				sent = otpService.sendOtpViaEmail(email, role);
				if (sent) {
					message = "OTP has been sent to your email address. Please check your inbox.";
				} else {
					message = "Failed to send OTP. Please ensure email configuration is correct.";
				}
			} else if ("mobile".equals(type)) {
				if (request.mobileNumber == null || request.mobileNumber.trim().isEmpty()) {
					return ResponseEntity.badRequest().body(OtpResponse.error("Mobile number is required"));
				}
				
				String mobile = request.mobileNumber.trim();
				
				// No need to check if user exists - OTP login works for new and existing users
				sent = otpService.sendOtpViaSms(mobile, role);
				if (sent) {
					message = "OTP has been sent to your mobile number. Please check your SMS.";
				} else {
					message = "Failed to send OTP. Please ensure SMS gateway is configured correctly.";
				}
			} else {
				return ResponseEntity.badRequest().body(OtpResponse.error("Invalid type. Use 'email' or 'mobile'"));
			}
			
			return sent 
				? ResponseEntity.ok(OtpResponse.success(message))
				: ResponseEntity.badRequest().body(OtpResponse.error(message));
		} catch (Exception e) {
			System.err.println("Error in sendOtp endpoint: " + e.getMessage());
			return ResponseEntity.badRequest().body(OtpResponse.error("Error sending OTP: " + e.getMessage()));
		}
	}
	
	@PostMapping("/otp/verify")
	public ResponseEntity<AuthResponse> verifyOtp(@RequestBody OtpVerifyRequest request) {
		try {
			if (request.otp == null || request.otp.length() != 5) {
				return ResponseEntity.badRequest().body(AuthResponse.error("Invalid OTP format"));
			}
			
			String type = request.type != null ? request.type.toLowerCase() : "";
			boolean isValid = false;
			User user = null;
			String roleFromOtp = null;
			
			if ("email".equals(type)) {
				if (request.email == null || request.email.trim().isEmpty()) {
					return ResponseEntity.badRequest().body(AuthResponse.error("Email is required"));
				}
				
				// Get role from OTP before verification
				roleFromOtp = otpService.getRoleFromOtp(request.email.trim().toLowerCase(), null, "email");
				
				isValid = otpService.verifyOtp(request.email.trim().toLowerCase(), null, request.otp, "email");
				if (isValid) {
					// Get or create user based on role from OTP
					Role role = roleFromOtp != null ? Role.valueOf(roleFromOtp.toUpperCase()) : Role.BUYER;
					user = userService.createOrGetUserForOtp(request.email.trim().toLowerCase(), null, role);
					
					// If farmer, ensure farmer profile exists
					if (role == Role.FARMER) {
						ensureFarmerProfileExists(user);
					}
				}
			} else if ("mobile".equals(type)) {
				if (request.mobileNumber == null || request.mobileNumber.trim().isEmpty()) {
					return ResponseEntity.badRequest().body(AuthResponse.error("Mobile number is required"));
				}
				
				// Get role from OTP before verification
				roleFromOtp = otpService.getRoleFromOtp(null, request.mobileNumber.trim(), "mobile");
				
				isValid = otpService.verifyOtp(null, request.mobileNumber.trim(), request.otp, "mobile");
				if (isValid) {
					// Get or create user based on role from OTP
					Role role = roleFromOtp != null ? Role.valueOf(roleFromOtp.toUpperCase()) : Role.BUYER;
					user = userService.createOrGetUserForOtp(null, request.mobileNumber.trim(), role);
					
					// If farmer, ensure farmer profile exists
					if (role == Role.FARMER) {
						ensureFarmerProfileExists(user);
					}
				}
			} else {
				return ResponseEntity.badRequest().body(AuthResponse.error("Invalid type. Use 'email' or 'mobile'"));
			}
			
			if (!isValid) {
				return ResponseEntity.badRequest().body(AuthResponse.error("Invalid or expired OTP"));
			}
			
			if (user == null) {
				return ResponseEntity.badRequest().body(AuthResponse.error("Failed to create or retrieve user"));
			}
			
			return ResponseEntity.ok(AuthResponse.ok(user.getId(), user.getName(), user.getEmail(), user.getRole()));
		} catch (Exception e) {
			return ResponseEntity.badRequest().body(AuthResponse.error("Error verifying OTP: " + e.getMessage()));
		}
	}
	
	/**
	 * Ensure farmer profile exists for the user
	 */
	private void ensureFarmerProfileExists(User user) {
		if (user.getEmail() == null) {
			return;
		}
		
		// Check if farmer already exists
		Optional<Farmer> farmerOpt = farmerRepository.findByEmail(user.getEmail());
		if (farmerOpt.isPresent()) {
			return;
		}
		
		// Create farmer profile
		Farmer farmer = new Farmer();
		farmer.setName(user.getName());
		farmer.setEmail(user.getEmail());
		farmerRepository.save(farmer);
	}
}



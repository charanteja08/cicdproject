package com.agrizen.auth.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.Random;
import java.util.concurrent.ConcurrentHashMap;

// Twilio imports for SMS
import com.twilio.Twilio;
import com.twilio.rest.api.v2010.account.Message;
import com.twilio.type.PhoneNumber;

@Service
public class OtpService {
	
	private static final int OTP_LENGTH = 5;
	private static final long OTP_EXPIRY_TIME = 5 * 60 * 1000; // 5 minutes
	
	// In-memory storage for OTPs: key -> OTP, expiry time
	private final Map<String, OtpData> otpStorage = new ConcurrentHashMap<>();
	
	@Autowired(required = false)
	private JavaMailSender mailSender;
	
	@Value("${twilio.account.sid:}")
	private String twilioAccountSid;
	
	@Value("${twilio.auth.token:}")
	private String twilioAuthToken;
	
	@Value("${twilio.phone.number:}")
	private String twilioPhoneNumber;
	
	private final Random random = new Random();
	
	static class OtpData {
		String otp;
		long expiryTime;
		String email;
		String mobileNumber;
		String role; // Store role for OTP-based registration
		
		OtpData(String otp, String email, String mobileNumber, String type, String role) {
			this.otp = otp;
			this.email = email;
			this.mobileNumber = mobileNumber;
			this.role = role;
			this.expiryTime = System.currentTimeMillis() + OTP_EXPIRY_TIME;
		}
		
		boolean isExpired() {
			return System.currentTimeMillis() > expiryTime;
		}
	}
	
	/**
	 * Generate a 5-digit OTP
	 */
	private String generateOtp() {
		return String.format("%05d", random.nextInt(100000));
	}
	
	/**
	 * Send OTP via email
	 * Returns true if OTP was sent successfully, false otherwise
	 */
	public boolean sendOtpViaEmail(String email, String role) {
		try {
			String otp = generateOtp();
			String key = "email:" + email.toLowerCase();
			
			// Store OTP with role information
			otpStorage.put(key, new OtpData(otp, email, null, "email", role));
			
			// Send email if mail sender is configured
			if (mailSender != null) {
				try {
					SimpleMailMessage message = new SimpleMailMessage();
					message.setTo(email);
					message.setSubject("AgriZen - Your Login OTP");
					message.setText("Your OTP for login is: " + otp + "\n\nThis OTP is valid for 5 minutes.\n\nIf you didn't request this, please ignore this email.");
					mailSender.send(message);
					// OTP sent successfully - no console logging
					return true;
				} catch (Exception e) {
					System.err.println("Failed to send email OTP: " + e.getMessage());
					return false;
				}
			} else {
				System.err.println("Email sender not configured. Please configure spring.mail.* properties in application.properties");
				return false;
			}
		} catch (Exception e) {
			System.err.println("Error in sendOtpViaEmail: " + e.getMessage());
			return false;
		}
	}
	
	/**
	 * Send OTP via SMS using Twilio
	 * Returns true if OTP was sent successfully, false otherwise
	 */
	public boolean sendOtpViaSms(String mobileNumber, String role) {
		try {
			String otp = generateOtp();
			String key = "mobile:" + mobileNumber;
			
			// Store OTP with role information
			otpStorage.put(key, new OtpData(otp, null, mobileNumber, "mobile", role));
			
			// Check if Twilio is configured
			if (twilioAccountSid == null || twilioAccountSid.isEmpty() || 
			    twilioAuthToken == null || twilioAuthToken.isEmpty() ||
			    twilioPhoneNumber == null || twilioPhoneNumber.isEmpty()) {
				System.err.println("Twilio SMS gateway not configured. Please configure twilio.account.sid, twilio.auth.token, and twilio.phone.number in application.properties");
				return false;
			}
			
			// Send SMS using Twilio
			try {
				Twilio.init(twilioAccountSid, twilioAuthToken);
				
				Message.creator(
					new PhoneNumber(mobileNumber),
					new PhoneNumber(twilioPhoneNumber),
					"Your AgriZen login OTP is: " + otp + ". Valid for 5 minutes."
				).create();
				
				// OTP sent successfully - no console logging
				return true;
			} catch (Exception e) {
				System.err.println("Failed to send SMS OTP: " + e.getMessage());
				return false;
			}
		} catch (Exception e) {
			System.err.println("Error in sendOtpViaSms: " + e.getMessage());
			return false;
		}
	}
	
	/**
	 * Get role from OTP before verification
	 */
	public String getRoleFromOtp(String email, String mobileNumber, String type) {
		String key;
		if ("email".equalsIgnoreCase(type) && email != null) {
			key = "email:" + email.toLowerCase();
		} else if ("mobile".equalsIgnoreCase(type) && mobileNumber != null) {
			key = "mobile:" + mobileNumber;
		} else {
			return null;
		}
		
		OtpData data = otpStorage.get(key);
		if (data == null || data.isExpired()) {
			return null;
		}
		
		return data.role;
	}
	
	/**
	 * Verify OTP
	 */
	public boolean verifyOtp(String email, String mobileNumber, String otp, String type) {
		if (otp == null || otp.length() != OTP_LENGTH) {
			return false;
		}
		
		String key;
		if ("email".equalsIgnoreCase(type) && email != null) {
			key = "email:" + email.toLowerCase();
		} else if ("mobile".equalsIgnoreCase(type) && mobileNumber != null) {
			key = "mobile:" + mobileNumber;
		} else {
			return false;
		}
		
		OtpData data = otpStorage.get(key);
		if (data == null) {
			return false;
		}
		
		// Check if expired
		if (data.isExpired()) {
			otpStorage.remove(key);
			return false;
		}
		
		// Verify OTP
		boolean isValid = data.otp.equals(otp);
		
		// Remove OTP after verification (one-time use)
		if (isValid) {
			otpStorage.remove(key);
		}
		
		return isValid;
	}
	
	/**
	 * Clean up expired OTPs
	 */
	public void cleanupExpiredOtps() {
		otpStorage.entrySet().removeIf(entry -> entry.getValue().isExpired());
	}
	
	/**
	 * Get stored email/mobile/role for OTP key (for verification response)
	 */
	public String getStoredEmail(String key) {
		OtpData data = otpStorage.get(key);
		return data != null ? data.email : null;
	}
	
	public String getStoredMobile(String key) {
		OtpData data = otpStorage.get(key);
		return data != null ? data.mobileNumber : null;
	}
	
	public String getStoredRole(String key) {
		OtpData data = otpStorage.get(key);
		return data != null ? data.role : null;
	}
	
}

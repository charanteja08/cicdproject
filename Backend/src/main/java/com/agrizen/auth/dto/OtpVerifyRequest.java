package com.agrizen.auth.dto;

public class OtpVerifyRequest {
	public String email;
	public String mobileNumber;
	public String otp;
	public String type; // "email" or "mobile"
}

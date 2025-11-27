package com.agrizen.auth.dto;

public class OtpRequest {
	public String email;
	public String mobileNumber;
	public String type; // "email" or "mobile"
	public String role; // "FARMER" or "BUYER" - to identify user type
}

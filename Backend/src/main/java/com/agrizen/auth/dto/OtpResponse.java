package com.agrizen.auth.dto;

public class OtpResponse {
	public boolean success;
	public String message;
	public boolean otpSent;
	
	public static OtpResponse success(String message) {
		OtpResponse r = new OtpResponse();
		r.success = true;
		r.message = message;
		r.otpSent = true;
		return r;
	}
	
	public static OtpResponse error(String message) {
		OtpResponse r = new OtpResponse();
		r.success = false;
		r.message = message;
		r.otpSent = false;
		return r;
	}
}

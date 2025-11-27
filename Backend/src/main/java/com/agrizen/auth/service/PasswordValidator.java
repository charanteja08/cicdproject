package com.agrizen.auth.service;

import org.springframework.stereotype.Component;

@Component
public class PasswordValidator {

	/**
	 * Validates password according to requirements:
	 * - At least 1 uppercase letter
	 * - At least 1 lowercase letter
	 * - At least 1 number (digit)
	 * - Length must be greater than 6 characters (minimum 7 characters)
	 * 
	 * @param password The password to validate
	 * @return true if password meets all requirements, false otherwise
	 */
	public boolean isValid(String password) {
		if (password == null || password.length() <= 6) {
			return false;
		}

		boolean hasUpperCase = false;
		boolean hasLowerCase = false;
		boolean hasDigit = false;

		for (char c : password.toCharArray()) {
			if (Character.isUpperCase(c)) {
				hasUpperCase = true;
			} else if (Character.isLowerCase(c)) {
				hasLowerCase = true;
			} else if (Character.isDigit(c)) {
				hasDigit = true;
			}
		}

		return hasUpperCase && hasLowerCase && hasDigit;
	}

	/**
	 * Gets a descriptive error message for password validation failures
	 * 
	 * @param password The password that failed validation
	 * @return Error message describing what's missing
	 */
	public String getValidationErrorMessage(String password) {
		if (password == null || password.length() <= 6) {
			return "Password must be more than 6 characters long";
		}

		boolean hasUpperCase = false;
		boolean hasLowerCase = false;
		boolean hasDigit = false;

		for (char c : password.toCharArray()) {
			if (Character.isUpperCase(c)) {
				hasUpperCase = true;
			} else if (Character.isLowerCase(c)) {
				hasLowerCase = true;
			} else if (Character.isDigit(c)) {
				hasDigit = true;
			}
		}

		StringBuilder error = new StringBuilder("Password must contain: ");
		boolean needsComma = false;
		
		if (!hasUpperCase) {
			error.append("at least one uppercase letter");
			needsComma = true;
		}
		if (!hasLowerCase) {
			if (needsComma) error.append(", ");
			error.append("at least one lowercase letter");
			needsComma = true;
		}
		if (!hasDigit) {
			if (needsComma) error.append(", ");
			error.append("at least one number");
		}

		return error.toString();
	}
}


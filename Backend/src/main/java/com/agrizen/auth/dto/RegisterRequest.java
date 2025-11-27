package com.agrizen.auth.dto;

import com.agrizen.auth.model.Role;
import com.fasterxml.jackson.annotation.JsonSetter;

public class RegisterRequest {
	public String name;
	public String email;
	public String password;
	public String mobileNumber;
	public Role role;
	
	@JsonSetter("role")
	public void setRoleFromString(String roleString) {
		if (roleString != null) {
			try {
				this.role = Role.valueOf(roleString.toUpperCase());
			} catch (IllegalArgumentException e) {
				// Invalid role, will be handled by validation
				this.role = null;
			}
		}
	}
	
	public void setRole(Role role) {
		this.role = role;
	}
}



package com.agrizen.auth.dto;

import com.agrizen.auth.model.Role;

public class AuthResponse {
	public boolean success;
	public String message;
	public Long userId;
	public Role role;
	public String name;
	public String email;

	public static AuthResponse ok(Long id, String name, String email, Role role) {
		AuthResponse r = new AuthResponse();
		r.success = true;
		r.message = "OK";
		r.userId = id;
		r.role = role;
		r.name = name;
		r.email = email;
		return r;
	}

	public static AuthResponse error(String message) {
		AuthResponse r = new AuthResponse();
		r.success = false;
		r.message = message;
		return r;
	}
}



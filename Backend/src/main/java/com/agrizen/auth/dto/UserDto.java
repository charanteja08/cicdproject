package com.agrizen.auth.dto;

import com.agrizen.auth.model.Role;

public class UserDto {
    public Long id;
    public String name;
    public String email;
    public String mobileNumber;
    public Role role;

    public static UserDto from(com.agrizen.auth.entity.User u) {
        UserDto d = new UserDto();
        d.id = u.getId();
        d.name = u.getName();
        d.email = u.getEmail();
        d.mobileNumber = u.getMobileNumber();
        d.role = u.getRole();
        return d;
    }
}

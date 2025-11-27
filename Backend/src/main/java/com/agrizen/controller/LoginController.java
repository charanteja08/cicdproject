package com.agrizen.controller;

import com.agrizen.auth.service.PasswordValidator;
import com.agrizen.model.Login;
import com.agrizen.repository.LoginRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/login")
@CrossOrigin
public class LoginController {
    @Autowired
    private LoginRepository loginRepository;
    
    @Autowired
    private BCryptPasswordEncoder passwordEncoder;
    
    @Autowired
    private PasswordValidator passwordValidator;

    @PostMapping
    public Login saveLogin(@RequestBody Login login) {
        // If password is provided, validate and encrypt it before saving
        if (login.getPassword() != null && !login.getPassword().trim().isEmpty()) {
            // Validate password requirements
            if (!passwordValidator.isValid(login.getPassword())) {
                throw new IllegalArgumentException(passwordValidator.getValidationErrorMessage(login.getPassword()));
            }
            
            // Encrypt password before saving
            String encryptedPassword = passwordEncoder.encode(login.getPassword());
            login.setPassword(encryptedPassword);
        }
        
        return loginRepository.save(login);
    }
} 